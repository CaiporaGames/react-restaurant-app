import { MenuItem } from "@/app/domain/menu";

// MENU SLICE
export interface MenuState {
  categories: { id: string; name: string; sort: number; items: MenuItem[] }[];
}

export const createMenuSlice = (): MenuState => ({
  categories: [],
});