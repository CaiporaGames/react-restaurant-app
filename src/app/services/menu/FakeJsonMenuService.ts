import type { IMenuService, CategoryWithItems, MenuItem } from "@/app/domain/menu";
import type { Locale } from "@/app/domain/common";

// Fetches a static JSON from /public/data/menu.json at runtime.
export class FakeJsonMenuService implements IMenuService {
  async fetchMenu(_locale: Locale): Promise<CategoryWithItems[]> {
    const res = await fetch("/data/menu.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load local menu.json");
    const data = await res.json();

    // data.categories already matches our expected shape
    return (data.categories ?? []).map((c: any) => ({
      category: {
        id: c.id,
        name_en: c.name_en,
        name_pt: c.name_pt,
        sort: c.sort ?? 100,
      },
      items: (c.items ?? []).map((r: any): MenuItem => ({
        id: r.id,
        category_id: r.category_id ?? c.id,
        name_en: r.name_en,
        name_pt: r.name_pt,
        description_en: r.description_en,
        description_pt: r.description_pt,
        photo_url: r.photo_url,
        price: r.price, // { priceCents, currency }
        is_active: r.is_active !== false,
        allergens: r.allergens ?? [],
      })),
    }));
  }
}
