import Link from "next/link";

export function Caja({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border border-[#ffd4e7] bg-white p-5 shadow-sm">{children}</section>;
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
    <div className="mb-4 rounded-xl border border-[#ffc7df] bg-[#fff3f9] p-3 text-sm">
      <p className="mb-2">{texto}</p>
      <Link href={href} className="font-medium text-[#c40056]">
        Completar ahora
      </Link>
    </div>
  );
}

export function ChipEstado({ estado }: { estado: string }) {
  const colores: Record<string, string> = {
    open: "bg-[#ffe8f3] text-[#c40056]",
    contracted: "bg-[#ffd4e7] text-[#a5004a]",
    completed: "bg-[#f5f5f5] text-slate-700",
    cancelled: "bg-[#ffdce9] text-[#a30048]"
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colores[estado] ?? "bg-slate-100 text-slate-700"}`}>
      {estado}
    </span>
  );
}

export function ChevronCircleLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primario text-2xl font-black leading-none text-white no-underline"
      aria-label={label}
    >
      &#8250;
    </Link>
  );
}

export function Stars({ value }: { value: number | null }) {
  if (value == null) return <span className="text-sm text-slate-500">Sin reseñas</span>;
  const rounded = Math.round(value * 10) / 10;
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#c40056]" aria-label={`Promedio ${rounded} de 5`}>
      <span className="text-base text-[#ff006e]">{"★".repeat(Math.max(0, Math.min(5, full)))}</span>
      <span className="text-base text-slate-300">{"★".repeat(Math.max(0, 5 - Math.max(0, Math.min(5, full))))}</span>
      <span className="ml-1 text-xs text-slate-600">{rounded.toFixed(1)}</span>
    </span>
  );
}

export function StarRatingField({ name, idPrefix }: { name: string; idPrefix: string }) {
  return (
    <fieldset>
      <legend className="mb-1 block text-sm font-medium">Puntaje</legend>
      <div className="star-rating">
        {[5, 4, 3, 2, 1].map((v) => (
          <span key={v}>
            <input id={`${idPrefix}-${v}`} type="radio" name={name} value={v} defaultChecked={v === 5} required />
            <label htmlFor={`${idPrefix}-${v}`} title={`${v} estrellas`}>
              ★
            </label>
          </span>
        ))}
      </div>
    </fieldset>
  );
}
