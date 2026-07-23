# Next.js + Stripe Webhooks Architecture

Este proyecto es una implementación educativa y de portafolio enfocada en la arquitectura de **Webhooks en tiempo real** para el procesamiento de pagos. Está construido con Next.js (App Router), TypeScript, Prisma ORM y PostgreSQL.

El objetivo principal es ilustrar cómo recibir, validar firmas criptográficas (HMAC-SHA256) y procesar notificaciones asíncronas de Stripe de manera segura y robusta.

---

## 🚀 Arquitectura y Flujo de Trabajo

El flujo de procesamiento de pagos sigue el siguiente ciclo de vida asíncrono:

1.  **Registro de Orden (`PENDING`)**: El usuario inicia una compra desde la App. La aplicación registra una orden en PostgreSQL a través de Prisma con estado `PENDING`.
2.  **Sesión de Pago**: Se inicializa una sesión en **Stripe Checkout** vinculando la orden de nuestra base de datos en los metadatos.
3.  **Procesamiento Asíncrono**: Stripe procesa el cobro del lado de su pasarela de forma segura.
4.  **Emisión del Webhook**: Stripe envía una petición HTTP POST en segundo plano a nuestro endpoint (`/api/webhooks/stripe`).
5.  **Validación HMAC**: El servidor recibe la petición, lee el cuerpo en texto crudo (`req.text()`) para no alterar los bytes, y valida la firma criptográfica usando el SDK de Stripe y la clave `STRIPE_WEBHOOK_SECRET`.
6.  **Actualización de Estado**: Si la validación criptográfica es exitosa, se actualiza el estado de la orden a `PAID` o `FAILED` de forma atómica en PostgreSQL.

---

## 🛠️ Tecnologías y Herramientas

*   **Framework**: Next.js 16 (App Router) + TypeScript.
*   **Base de datos**: PostgreSQL corriendo localmente en Docker.
*   **ORM**: Prisma ORM (v5).
*   **Estilos**: Tailwind CSS con diseño oscuro moderno y responsivo.
*   **SDK Pasarela**: `stripe` para la creación de sesiones y validación criptográfica.

---

## 📦 Configuración del Proyecto

### 1. Requisitos Previos
*   [Node.js](https://nodejs.org/) (versión 20 o superior recomendada).
*   [Docker](https://www.docker.com/) instalado y corriendo en tu máquina.
*   [Stripe CLI](https://docs.stripe.com/stripe-cli) para reenviar los webhooks localmente.

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:

```env
# Base de Datos (PostgreSQL en Docker)
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/stripe_webhooks_db?schema=public"

# Claves de la API de Stripe (Modo de prueba)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# URL de la Aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Levantar la Base de Datos (PostgreSQL)
El proyecto incluye un archivo `docker-compose.yml` para levantar PostgreSQL rápidamente:
```bash
docker compose up -d
```

### 4. Sincronizar el Esquema de Prisma
Genera las tablas y enums de la base de datos local:
```bash
npx prisma db push
```

### 5. Configurar Stripe CLI
Para recibir los webhooks en tu servidor de desarrollo local:
1. Inicia sesión en tu cuenta de Stripe:
   ```bash
   stripe login
   ```
2. Reenvía los eventos de webhooks hacia tu API de desarrollo local:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Copia el secreto de firma (`whsec_...`) generado en la terminal y pégalo en la variable `STRIPE_WEBHOOK_SECRET` de tu archivo `.env`.

### 6. Levantar el Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para simular compras.

---

## 🔒 Detalles de Seguridad en el Webhook

La lógica de seguridad se implementa en el archivo `src/app/api/webhooks/stripe/route.ts`:
*   **Lectura Cruda del Payload**: La firma criptográfica HMAC requiere validar la cadena binaria exacta transmitida por la red. Next.js lee el body usando `await req.text()`.
*   **Verificación HMAC**: El método `stripe.webhooks.constructEvent` garantiza que la petición proviene legítimamente de los servidores de Stripe utilizando el hash de la cabecera `stripe-signature` y nuestro secreto de firma compartido.
