import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOZ",
  description: "Marketplace de mozos y restaurantes"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <main className="min-h-screen w-full px-4 py-5 md:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-4">{children}</div>
        </main>
      </body>
    </html>
  );
}
