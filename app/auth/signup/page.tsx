import Link from "next/link";
import { signupAction } from "@/lib/auth-actions";

export default function SignupPage({
  searchParams
}: {
  searchParams: { role?: string; error?: string };
}) {
  const role = searchParams.role;

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>
      {!role && <p className="rounded-lg bg-amber-50 p-2 text-sm">Elegí tu perfil para continuar.</p>}
      {searchParams.error && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{searchParams.error}</p>}

      <form action={signupAction} className="space-y-3">
        {!role ? (
          <select name="role" defaultValue="">
            <option value="" disabled>
              Seleccionar rol
            </option>
            <option value="restaurant">Restaurante</option>
            <option value="waiter">Mozo</option>
          </select>
        ) : (
          <input type="hidden" name="role" value={role} />
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Contraseña
          </label>
          <input id="password" name="password" type="password" minLength={6} required />
        </div>

        <button type="submit" className="w-full">
          Crear cuenta
        </button>
      </form>

      <p className="text-sm text-slate-600">
        ¿Ya tenés cuenta? <Link href="/auth/login">Iniciar sesión</Link>
      </p>
    </div>
  );
}
