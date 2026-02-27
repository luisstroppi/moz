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
    <header className="mb-6 rounded-2xl border border-amber-100 bg-white/95 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-amber-700">MOZ</p>
          <h1 className="text-xl font-semibold">{titulo}</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit">Cerrar sesión</button>
        </form>
      </div>
      <nav className="mt-4 flex flex-wrap gap-3 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-1 no-underline hover:bg-amber-50"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
