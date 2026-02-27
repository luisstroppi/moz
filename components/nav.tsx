import Link from "next/link";
import { logoutAction } from "@/lib/auth-actions";

export function NavPortal({
  titulo,
  links
}: {
  titulo: string;
  links: { href: string; label: string }[];
}) {
  return (
    <header className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">MOZ</p>
          <h1 className="text-xl font-semibold">{titulo}</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit">Cerrar sesión</button>
        </form>
      </div>
      <nav className="mt-4 flex flex-wrap gap-3 text-sm">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-lg border border-slate-200 px-3 py-1 no-underline hover:bg-slate-50">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
