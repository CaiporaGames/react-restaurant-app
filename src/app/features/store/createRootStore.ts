import { create } from "zustand";
import { createMenuSlice, MenuState } from "./slices/menuSlice";
import { CartState, createCartSlice } from "./slices/cartSlice";
import { createPreferencesSlice, PreferencesState } from "./slices/preferencesSlice";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export interface RootState extends MenuState, CartState, PreferencesState {}

export const useRootStore = create<RootState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createMenuSlice(),
        ...createCartSlice(set, get),
        ...createPreferencesSlice((p) => set(p as any)),
      }),
      {
        name: "restaurant-prefs",
        storage: createJSONStorage(() => localStorage),
        // Persist user prefs AND (optionally) the cart lines so totals survive reloads:
        partialize: (state) => ({
          locale: state.locale,
          themeMode: state.themeMode,
          lines: state.lines, // ← remove this line if you don't want cart persistence
        }),
        version: 2,
      }
    )
  )
);