import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

// IMPORTANTE: Definimos la constante del Webhook Secret desde las variables de entorno
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // 1. LEER EL BODY COMO TEXTO CRUDO (RAW TEXT)
  // Explicación: No podemos usar req.json() porque Stripe genera la firma HMAC usando
  // los bytes exactos del cuerpo crudo (incluyendo espacios en blanco y saltos de línea).
  // Analizar el JSON de antemano alteraría esta cadena y causaría que la firma falle.
  let payload: string;
  try {
    payload = await req.text();
  } catch (err: unknown) {
    console.error('Error leyendo el raw body del webhook:', err);
    return NextResponse.json({ error: 'No se pudo leer el cuerpo de la petición' }, { status: 400 });
  }

  // 2. OBTENER LA CABECERA DE FIRMA (stripe-signature)
  // La cabecera stripe-signature contiene el timestamp y la firma criptográfica (HMAC-SHA256)
  // provista por Stripe para mitigar ataques de repetición y spoofing.
  const headerPayload = await headers();
  const sig = headerPayload.get('stripe-signature');

  if (!sig) {
    console.error('Falta la cabecera stripe-signature.');
    return NextResponse.json({ error: 'Falta la firma en la cabecera' }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET no está configurada.');
    return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 });
  }

  let event: Stripe.Event;

  // 3. VERIFICACIÓN DE SEGURIDAD (HMAC-SHA256 validation)
  // Aquí es donde ocurre la validación criptográfica de seguridad de Stripe.
  // El SDK de Stripe recrea localmente la firma combinando el cuerpo crudo de la petición (payload),
  // la cabecera de firma (sig) y nuestro secreto compartido (webhookSecret).
  // Si coinciden, significa que la notificación fue enviada legítimamente por Stripe.
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error(`[VERIFICACIÓN FALLIDA]: Firma inválida. Detalle: ${message}`);
    return NextResponse.json(
      { error: `Fallo en la validación de la firma: ${message}` },
      { status: 400 }
    );
  }

  console.log(`[WEBHOOK RECIBIDO]: Evento de tipo "${event.type}" validado correctamente.`);

  // 4. PROCESAR EL EVENTO Y ACTUALIZAR POSTGRESQL MEDIANTE PRISMA
  try {
    switch (event.type) {
      // Evento disparado cuando un flujo de Stripe Checkout se completa de forma exitosa
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Recuperamos el ID de la orden que guardamos previamente en client_reference_id
        const orderId = session.client_reference_id;

        if (!orderId) {
          console.warn('[WEBHOOK WARNING]: checkout.session.completed no contiene client_reference_id.');
          break;
        }

        console.log(`[PROCESANDO PAGO]: Transicionando la orden ${orderId} a estado PAID.`);

        // Conexión a PostgreSQL: Actualizamos el registro del estado de la orden de PENDING a PAID
        await db.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            // Opcionalmente podemos registrar el ID de la sesión si no lo hicimos en el checkout
            stripeSessionId: session.id,
          },
        });
        
        break;
      }

      // Evento disparado si la sesión de Checkout expira sin que el usuario haya pagado
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.client_reference_id;

        if (!orderId) {
          console.warn('[WEBHOOK WARNING]: checkout.session.expired no contiene client_reference_id.');
          break;
        }

        console.log(`[PAGO EXPIRADO]: Transicionando la orden ${orderId} a estado FAILED.`);

        // Conexión a PostgreSQL: Actualizamos el registro de la orden a FAILED
        await db.order.update({
          where: { id: orderId },
          data: { status: 'FAILED' },
        });

        break;
      }

      default:
        // Es una buena práctica registrar pero ignorar los tipos de eventos que no nos interesan.
        console.log(`[WEBHOOK INFO]: Evento "${event.type}" no está configurado para cambiar estados.`);
        break;
    }

    // Retornamos un 200 OK a Stripe para confirmar el procesamiento correcto.
    // Si no retornamos un 2xx, Stripe reintentará enviar el webhook periódicamente.
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    console.error('[DATABASE_ERROR]: Error al actualizar la base de datos en el Webhook:', err);
    const message = err instanceof Error ? err.message : 'Error desconocido';
    // Retornamos 500 si hay un error en nuestra BD para que Stripe intente enviarlo de nuevo más tarde
    return NextResponse.json({ error: `Error interno de procesamiento: ${message}` }, { status: 500 });
  }
}
