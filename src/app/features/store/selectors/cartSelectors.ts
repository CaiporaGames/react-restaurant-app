"use client";
import { useMemo } from "react";
import { useRootStore } from "@/app/features/store/createRootStore";
import { useMenu } from "./menuSelectors";
export const useOrders = () => useRootStore((s) => s.orders);

/** Rows for the “Due” drawer: aggregated across all placed orders */
export const useDueItemsDetailed = () => {
  const orders = useOrders();
  const categories = useMenu();

  return useMemo(() => {
    // Build a quick index itemId -> menu item (to fetch image)
    const menuIndex = new Map<string, any>();
    categories.forEach((c) => c.items.forEach((it) => menuIndex.set(it.id, it)));

    // Aggregate lines across all placed orders
    const acc = new Map<string, {
      id: string;
      name: string;
      photo_url?: string;
      qty: number;
      unitCents: number;
      subtotalCents: number;
      currency: string;
    }>();

    orders.filter(o => o.status === "placed").forEach(o => {
      o.items.forEach(l => {
        const k = l.itemId;
        const existing = acc.get(k);
        const item = menuIndex.get(k);
        if (existing) {
          existing.qty += l.qty;
          existing.subtotalCents += l.qty * l.priceCents;
        } else {
          acc.set(k, {
            id: k,
            name: l.name,                   // snapshot name at order time
            photo_url: item?.photo_url,     // best effort
            qty: l.qty,
            unitCents: l.priceCents,
            subtotalCents: l.qty * l.priceCents,
            currency: l.currency || "EUR",
          });
        }
      });
    });

    return Array.from(acc.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [orders, categories]);
};

export const useCartLines = () => useRootStore(s => s.lines);


export const useCartSummary = () => {
const lines = useCartLines();
return useMemo(() => {
const entries = Object.values(lines);
const totalCents = entries.reduce((acc, l) => acc + l.qty * l.priceCents, 0);
const totalQty = entries.reduce((acc, l) => acc + l.qty, 0);
return { totalCents, totalQty };
}, [lines]);
};


export const useCartActions = () => ({
add: (item: any) => useRootStore.getState().add(item),
dec: (id: string) => useRootStore.getState().dec(id),
setQty: (item: any, qty: number) => useRootStore.getState().setQty(item, qty),
clear: () => useRootStore.getState().clear(),
});

export const useCartDetailed = () => {
  const lines = useCartLines();
  const categories = useMenu();
  return useMemo(() => {
    const index = new Map<string, any>();
    categories.forEach((c) => c.items.forEach((it) => index.set(it.id, it)));

    return Object.values(lines).map((l) => {
      const item = index.get(l.itemId);
      const currency = item?.price.currency ?? "EUR";
      return {
        id: l.itemId,
        name: item?.name_en ?? l.name,
        photo_url: item?.photo_url as string | undefined,
        qty: l.qty,
        priceCents: l.priceCents,
        currency,
        subtotalCents: l.qty * l.priceCents,
        itemRef: item, // pass back to setQty/add if needed
      };
    });
  }, [lines, categories]);
};

export const useOrderActions = () => ({
  placeOrder: () => useRootStore.getState().placeOrder(),
});

export const useLastOrder = () => {
  const orders = useOrders();
  return orders.length ? orders[orders.length - 1] : null;
};
/** Sum of all placed orders (amount the guest already owes) */
export const useOrdersDueSummary = () => {
  const orders = useOrders();
  return useMemo(() => {
    const openOrders = orders.filter((o) => o.status === "placed");
    const dueCents = openOrders.reduce((acc, o) => acc + o.totalCents, 0);
    const currency = openOrders[0]?.currency ?? "EUR";
    const count = openOrders.length;
    return { dueCents, count, currency };
  }, [orders]);
};