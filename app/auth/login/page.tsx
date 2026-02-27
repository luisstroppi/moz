import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";

export default function LoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
      {searchParams.error && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{searchParams.error}</p>}

      <form action={loginAction} className="space-y-3">
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
          <input id="password" name="password" type="password" required />
        </div>

        <button type="submit" className="w-full">
          Entrar
        </button>
      </form>

      <p className="text-sm text-slate-600">
        ¿No tenés cuenta? <Link href="/auth/signup">Registrate</Link>
      </p>
    </div>
  );
}
