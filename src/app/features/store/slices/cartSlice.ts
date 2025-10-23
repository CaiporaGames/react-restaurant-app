import { MenuItem } from "@/app/domain/menu";

/* ---------- TYPES ---------- */
export interface CartLine {
  itemId: string;
  qty: number;
  priceCents: number;
  currency: string;     // ✅ keep currency per line
  name: string;
}

export interface PlacedOrder {
  id: string;
  items: CartLine[];    // snapshot at order time
  totalCents: number;
  currency: string;
  createdAt: string;    // ISO
  status: "placed";
}

/* ---------- CART SLICE ---------- */
export interface CartState {
  lines: Record<string, CartLine>;
  orders: PlacedOrder[];                  // ✅ history of finalized orders
  add: (item: MenuItem) => void;
  dec: (itemId: string) => void;
  setQty: (item: MenuItem, qty: number) => void;
  clear: () => void;
  placeOrder: () => void;                 // ✅ finalize current cart
}

export const createCartSlice = (set: any, get: any): CartState => ({
  lines: {},
  orders: [],

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
            currency: item.price.currency,   // ✅ record currency
            name: item.name_en,              // already localized display name
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
          currency: item.price.currency,     // ✅ record currency
          name: item.name_en,
        };
      }
      return { lines: next };
    });
  },

  clear: () => set({ lines: {} }),

  // ✅ Finalize the current cart into an immutable order and start a fresh cart
  placeOrder: () => {
    set((state: CartState) => {
      const items = Object.values(state.lines);
      if (items.length === 0) return {}; // nothing to place

      const totalCents = items.reduce((a, l) => a + l.qty * l.priceCents, 0);
      const currency = items[0]?.currency ?? "EUR";
      const order: PlacedOrder = {
        id: `ord_${Date.now()}`,
        items,
        totalCents,
        currency,
        createdAt: new Date().toISOString(),
        status: "placed",
      };
      return {
        orders: [...state.orders, order],
        lines: {}, // ✅ new selections start a brand-new list
      };
    });
  },
});