"use client";

import { useEffect, useState } from "react";
import { useSetMenu } from "@/app/features/store"; // your selector to set menu state
import { useDeps } from "@/app/config/DepsContext";
import { useI18n } from "@/app/hooks/useI18n";
import type { MenuItem } from "@/app/domain/menu";

/**
 * Orchestrates fetching from the active service (fake JSON now).
 * Writes normalized data to Zustand via selector.
 */
export function useMenuController(tableCode?: string) {
  const { locale } = useI18n();
  const { menuService } = useDeps();
  const setMenu = useSetMenu();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    menuService
      .fetchMenu(locale, tableCode)
      .then((list) => {
        if (!alive) return;

        // Localize category/item names using current locale
        const mapped = list.map(({ category, items }) => ({
          id: category.id,
          name: locale === "pt" ? category.name_pt : category.name_en,
          sort: category.sort,
          items: items.map((it: MenuItem) => ({
            ...it,
            name_en: locale === "pt" ? it.name_pt : it.name_en, // reusing "name_en" prop as display text
            description_en:
              locale === "pt" ? it.description_pt : it.description_en,
          })),
        }));

        setMenu(mapped as any); // write into Zustand
        setError(null);
      })
      .catch((e) => setError(e?.message ?? "Failed to load menu"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [locale, menuService, setMenu, tableCode]);

  return { loading, error };
}
