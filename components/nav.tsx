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
    <header className="mb-6 rounded-2xl border border-[#154C52]/25 bg-[#154C52] p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-[#F0CD1B]">Moz by Giunti</p>
          <h1 className="text-xl font-semibold text-[#FDF9E8]">{titulo}</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="bg-[#5E1F1F] text-[#FDF9E8]">
            Cerrar sesión
          </button>
        </form>
      </div>
      <nav className="mt-4 flex flex-wrap gap-3 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-[#FDF9E8]/40 bg-[#FDF9E8]/10 px-3 py-1 text-[#FDF9E8] no-underline hover:bg-[#FDF9E8]/20"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
