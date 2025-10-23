// Pure types + the menu service contract used by controllers/UI

import type { Locale } from "@/app/domain/common";

export interface MenuCategory {
  id: string;
  name_en: string;
  name_pt: string;
  sort: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name_en: string;
  name_pt: string;
  description_en?: string;
  description_pt?: string;
  photo_url?: string;
  price: { priceCents: number; currency: string };
  is_active: boolean;
  allergens?: string[];
}

export interface CategoryWithItems {
  category: MenuCategory;
  items: MenuItem[];
}

export interface IMenuService {
  // Controller asks for the menu; implementation can come from JSON, DB, etc.
  fetchMenu(locale: Locale, tableCode?: string): Promise<CategoryWithItems[]>;
}
