"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { IMenuService } from "@/app/domain/menu";
import { ENV, USING_SUPABASE } from "@/app/config/env";
import { FakeJsonMenuService } from "@/app/services/menu/FakeJsonMenuService";
// Optional: keep the import here so flipping later is one-line
// import { SupabaseMenuService } from "@/services/menu/SupabaseMenuService";

export interface Deps {
  menuService: IMenuService;
}

const DepsContext = createContext<Deps | null>(null);

/**
 * Construct all services exactly once.
 * For now we always use FakeJsonMenuService (USE_FAKE_DATA = true).
 * Later, set USE_FAKE_DATA = false and provide Supabase keys to flip seamlessly.
 */
export const DepsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const deps = useMemo<Deps>(() => {
    if (USING_SUPABASE) {
      // return { menuService: new SupabaseMenuService() };
      // (Keep commented until you actually add Supabase)
    }
    return { menuService: new FakeJsonMenuService() }; // ✅ static JSON
  }, [/* no deps => construct once */]);

  return <DepsContext.Provider value={deps}>{children}</DepsContext.Provider>;
};

export const useDeps = (): Deps => {
  const ctx = useContext(DepsContext);
  if (!ctx) throw new Error("DepsProvider is missing (wrap your app with it in layout.tsx)");
  return ctx;
};
