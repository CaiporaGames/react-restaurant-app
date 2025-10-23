"use client";

import { useEffect, useState } from "react";
import { useThemeMode } from "@/app/features/store";

/**
 * Applies/removes the `dark` class on <html> based on:
 * - user preference in store (light|dark|system)
 * - system preference if mode === 'system'
 */
export default function ThemeClient() {
  const mode = useThemeMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // avoid SSR/client mismatch
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    const apply = () => {
      const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      const shouldDark = mode === "dark" || (mode === "system" && systemPrefersDark);
      root.classList.toggle("dark", !!shouldDark);
    };

    apply();

    // Listen for system changes if in "system" mode
    let media: MediaQueryList | undefined;
    const onChange = () => apply();

    if (mode === "system" && window.matchMedia) {
      media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener?.("change", onChange);
    }

    return () => {
      media?.removeEventListener?.("change", onChange);
    };
  }, [mode, mounted]);

  return null;
}
