"use client";
import { useRootStore } from "@/app/features/store/createRootStore";
import type { Locale } from "@/app/domain/common";
import type { ThemeMode } from "@/app/features/store/slices/preferencesSlice";

// Read selectors
export const useLocale = () => useRootStore(s => s.locale);
export const useThemeMode = () => useRootStore(s => s.themeMode);

// Action selectors (stable identity)
export const usePreferencesActions = () => ({
  setLocale: (l: Locale) => useRootStore.getState().setLocale(l),
  setThemeMode: (m: ThemeMode) => useRootStore.getState().setThemeMode(m),
});
