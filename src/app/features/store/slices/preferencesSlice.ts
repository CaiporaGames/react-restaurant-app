// "use client" not needed here; createRootStore will mark the bundle as client
import type { Locale } from "@/app/domain/common";

export type ThemeMode = "light" | "dark" | "system";

export interface PreferencesState {
  // persisted user prefs
  locale: Locale;
  themeMode: ThemeMode;

  // actions
  setLocale: (l: Locale) => void;
  setThemeMode: (m: ThemeMode) => void;
}

// Factory to merge in the root store
export const createPreferencesSlice = (
  set: (p: Partial<PreferencesState>) => void
): PreferencesState => ({
  // defaults (first visit)
  locale: "en",
  themeMode: "system",

  setLocale: (locale) => set({ locale }),
  setThemeMode: (themeMode) => set({ themeMode }),
});
