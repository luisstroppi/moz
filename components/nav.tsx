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
    <header className="mb-6 rounded-2xl border border-[#ffbddb] bg-gradient-to-r from-[#ff006e] to-[#c40056] p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-[#ffd4e7]">PedidosYa Operations</p>
          <h1 className="text-xl font-semibold text-white">{titulo}</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="bg-white text-[#c40056] hover:bg-[#fff0f7]">
            Cerrar sesión
          </button>
        </form>
      </div>
      <nav className="mt-4 flex flex-wrap gap-3 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className="rounded-xl border border-white/45 bg-white/15 px-3 py-1 text-white no-underline hover:bg-white/25"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
