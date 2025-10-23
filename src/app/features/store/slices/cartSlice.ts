import { MenuItem } from "@/app/domain/menu";

// CART SLICE
export interface CartLine {
  itemId: string;
  qty: number;
  priceCents: number;
  name: string;
}
export interface CartState {
  lines: Record<string, CartLine>; // key=itemId
  add(item: MenuItem): void;
  dec(itemId: string): void;
  setQty(item: MenuItem, qty: number): void;
  clear(): void;
}

export const createCartSlice = (set: any, get: any): CartState => ({
  lines: {},
  add: (item) => {
    const key = item.id;
    set((state: CartState) => {
      const prev = state.lines[key];
      const nextQty = (prev?.qty ?? 0) + 1;
      return {
        lines: {
          ...state.lines,
          [key]: {
            itemId: key,
            qty: nextQty,
            priceCents: item.price.priceCents,
            name: item.name_en, // currently localized name
          },
        },
      };
    });
  },
   dec: (itemId) => {
    set((state: CartState) => {
      const prev = state.lines[itemId];
      if (!prev) return { lines: state.lines };
      const nextQty = prev.qty - 1;
      const next = { ...state.lines };
      if (nextQty <= 0) delete next[itemId];
      else next[itemId] = { ...prev, qty: nextQty };
      return { lines: next };
    });
  },

  setQty: (item, qty) => {
    const key = item.id;
    set((state: CartState) => {
      const next = { ...state.lines };
      if (qty <= 0) {
        delete next[key];
      } else {
        next[key] = {
          itemId: key,
          qty,
          priceCents: item.price.priceCents,
          name: item.name_en,
        };
      }
      return { lines: next };
    });
  },

  clear: () => set({ lines: {} }),
});