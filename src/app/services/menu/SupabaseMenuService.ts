import type { IMenuService, CategoryWithItems, MenuItem } from "@/app/domain/menu";
import { supabase } from "@/app/services/supabaseClient";
import type { Locale } from "@/app/domain/common";

export class SupabaseMenuService implements IMenuService {
  async fetchMenu(_locale: Locale, tableCode?: string): Promise<CategoryWithItems[]> {
    if (!supabase) throw new Error("Supabase not configured");

    // Optional: look up restaurant by tableCode (QR data)
    let restaurantId: string | null = null;
    if (tableCode) {
      const { data: tableRow, error } = await supabase
        .from("tables")
        .select("restaurant_id")
        .eq("code", tableCode)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      restaurantId = tableRow?.restaurant_id ?? null;
    }

    // 1) categories for restaurant
    const { data: cats, error: cErr } = await supabase
      .from("categories")
      .select("id, name_en, name_pt, sort")
      .eq("is_active", true)
      .order("sort", { ascending: true })
      .maybeSingle();

    // Note: some Supabase clients need .select without maybeSingle if multiple rows. We'll requery properly:
    const { data: categories, error: cErr2 } = await supabase
      .from("categories")
      .select("id, name_en, name_pt, sort")
      .eq("is_active", true)
      .order("sort", { ascending: true });

    if (cErr || cErr2) throw (cErr || cErr2);

    // 2) items for those categories
    const catIds = (categories ?? []).map(c => c.id);
    const { data: items, error: iErr } = await supabase
      .from("items")
      .select("id, category_id, name_en, name_pt, description_en, description_pt, photo_url, price_cents, currency, is_active")
      .in("category_id", catIds)
      .eq("is_active", true);

    if (iErr) throw iErr;

    // 3) allergens per item (optional)
    const { data: allergens, error: aErr } = await supabase
      .from("item_allergens_view") // we’ll define a helper view later
      .select("item_id, codes");
    if (aErr) throw aErr;

    const allergenMap = new Map<string, string[]>();
    (allergens ?? []).forEach(row => allergenMap.set(row.item_id, row.codes));

    const itemsByCat = new Map<string, MenuItem[]>();
    (items ?? []).forEach((r: any) => {
      const it: MenuItem = {
        id: r.id,
        category_id: r.category_id,
        name_en: r.name_en,
        name_pt: r.name_pt,
        description_en: r.description_en ?? undefined,
        description_pt: r.description_pt ?? undefined,
        photo_url: r.photo_url ?? undefined,
        price: { priceCents: r.price_cents, currency: r.currency },
        is_active: r.is_active,
        allergens: allergenMap.get(r.id) ?? [],
      };
      const arr = itemsByCat.get(r.category_id) ?? [];
      arr.push(it);
      itemsByCat.set(r.category_id, arr);
    });

    return (categories ?? []).map((c: any) => ({
      category: c,
      items: itemsByCat.get(c.id) ?? [],
    }));
  }
}
