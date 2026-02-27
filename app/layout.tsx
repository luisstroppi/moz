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
        <main className="min-h-screen w-full">{children}</main>
      </body>
    </html>
  );
}
