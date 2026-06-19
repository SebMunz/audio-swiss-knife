import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";

export const metadata: Metadata = {
  title: "Audio Swiss Knife",
  description: "Client-side calculators for acoustics, signal, codecs, mastering and music theory."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-visual-mode="normal">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
