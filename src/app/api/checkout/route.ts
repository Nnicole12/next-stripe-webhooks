import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency, customerEmail } = body;

    // Validación de campos obligatorios
    if (!amount || !currency || !customerEmail) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: amount, currency, customerEmail.' },
        { status: 400 }
      );
    }

    // 1. Crear el registro inicial de la orden en la base de datos como PENDING
    const order = await db.order.create({
      data: {
        customerEmail,
        amount: Number(amount),
        currency: String(currency).toLowerCase(),
        status: 'PENDING',
      },
    });

    // 2. Crear la sesión de Checkout en Stripe
    // Asociaremos el ID de nuestra orden como `client_reference_id` y en los `metadata`
    // para recuperarlo fácilmente cuando se reciba el Webhook.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: String(currency).toLowerCase(),
            product_data: {
              name: 'Curso de Arquitectura de Webhooks',
              description: `Orden de compra ID: ${order.id}`,
            },
            unit_amount: Number(amount), // Se asume que ya viene expresado en centavos (ej: 1000 = $10.00 USD)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      customer_email: customerEmail,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
      },
    });

    // 3. Asociar el ID de la sesión de Stripe recién creada a nuestra orden en la BD
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    // Retornamos la URL de Stripe Checkout para redirigir al cliente
    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('[CHECKOUT_ERROR]:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
