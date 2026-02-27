import Link from "next/link";

export function Caja({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">{children}</section>;
}

export function Titulo({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>;
}

export function Subtitulo({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function BannerPerfil({
  texto,
  href
}: {
  texto: string;
  href: string;
}) {
  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
      <p className="mb-2">{texto}</p>
      <Link href={href} className="font-medium text-amber-800">
        Completar ahora
      </Link>
    </div>
  );
}

export function ChipEstado({ estado }: { estado: string }) {
  const colores: Record<string, string> = {
    open: "bg-emerald-100 text-emerald-800",
    contracted: "bg-sky-100 text-sky-800",
    completed: "bg-slate-200 text-slate-800",
    cancelled: "bg-rose-100 text-rose-800"
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colores[estado] ?? "bg-slate-100 text-slate-700"}`}>
      {estado}
    </span>
  );
}
