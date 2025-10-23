"use client";
import { useCallback } from "react";
import { useRootStore } from "@/app/features/store/createRootStore";

// Read selector (unchanged)
export const useMenu = () => useRootStore(s => s.categories);

// ✅ Return a stable function so it doesn't change identity each render
export const useSetMenu = () => {
  return useCallback(
    (categories: ReturnType<typeof useMenu>) => {
      useRootStore.setState({ categories });
    },
    []
  );
};
