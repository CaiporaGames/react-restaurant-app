import type { Metadata } from "next";
import { DepsProvider } from "@/app/config/DepsContext";
import { I18nProvider } from "@/app/hooks/useI18n";
import ThemeClient from "./ThemeClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurant Menu",
  description: "QR-driven menu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DepsProvider>
          <I18nProvider>
            {/* ✅ applies dark class based on persisted preference */}
            <ThemeClient />
            {children}
          </I18nProvider>
        </DepsProvider>
      </body>
    </html>
  );
}
