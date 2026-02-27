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
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 md:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
