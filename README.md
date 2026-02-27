# Moz by Giunti MVP

Marketplace tipo Uber para conectar **restaurantes** y **mozos** por turnos.

## Stack

- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)
- Deploy listo para Vercel

## Funcionalidades MVP

- Registro/Login con rol: `restaurant` o `waiter`
- Portal restaurante:
  - Completar perfil
  - Publicar turnos
  - Definir puesto del turno (`mozo`, `runner`, `bacha`, `cafetero`, `mozo de mostrador`)
  - Ver postulantes
  - Contratar mozo
  - Marcar turno como completado
  - Calificar mozo
  - CRUD de instructivos (políticas/cultura + capacitación por puesto)
- Portal mozo:
  - Completar perfil
  - Buscar turnos abiertos (filtro por fecha y restaurante)
  - Postularse/cancelar postulación
  - Ver mis turnos
  - Calificar restaurante en turnos completados
  - Ver reseñas recibidas y reseñas realizadas
  - Ver link de propina + QR
- Página pública de propina: `/tip/[waiterId]` (simulada)

## Requisitos

- Node.js 20+
- Cuenta/proyecto en Supabase
- Recomendado para MVP: en Supabase Auth desactivar `Confirm email` para login inmediato tras registro

## Variables de entorno

Crear `.env.local` usando `.env.example`:

```bash
cp .env.example .env.local
```

Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (ej. `http://localhost:3000` en local)

## Setup local

```bash
npm install
npm run dev
```

App en: [http://localhost:3000](http://localhost:3000)

## Supabase: esquema y migraciones

### Opción A: SQL Editor (rápida)

1. Abrir Supabase Dashboard > SQL Editor.
2. Ejecutar `supabase/migrations/202602270001_init_moz.sql`.
3. Ejecutar `supabase/migrations/202602270002_roles_and_instruction_split.sql`.
4. Ejecutar `supabase/migrations/202602270003_waiter_shift_visibility.sql`.

### Opción B: Supabase CLI

```bash
supabase db push
```

## Seed opcional

Archivo: `supabase/seed.sql`

- Crea datos demo tomando el primer restaurante y el primer mozo existentes en `profiles`.
- Ejecutarlo después de tener al menos 1 usuario de cada rol registrado.

## RLS implementado

- `profiles`: cada usuario lee/escribe su propio perfil.
- `restaurants` / `waiters`: lectura autenticada, escritura solo propia.
- `instructions`: restaurante CRUD de sus instructivos, lectura autenticada.
- `shifts`: restaurante CRUD propios; mozos leen solo turnos `open`.
- `applications`: mozo crea/lee/actualiza propias; restaurante lee/actualiza postulaciones de sus turnos.
- `ratings`: creación solo si el turno está `completed` y el usuario participa en ese turno.
- `tips`: inserción pública (simulada), lectura solo para el mozo dueño.

## Deploy en Vercel

1. Subir repo a GitHub.
2. Importar proyecto en Vercel.
3. Configurar env vars de producción:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (URL de Vercel)
4. Deploy.

## Estructura principal

- `app/`: rutas App Router
- `components/`: UI simple reutilizable
- `lib/`: auth, cliente supabase, helpers
- `supabase/migrations/`: SQL de schema + RLS
- `supabase/seed.sql`: datos demo opcionales
