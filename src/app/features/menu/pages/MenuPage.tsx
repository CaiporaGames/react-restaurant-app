"use client";
import React, { useMemo, useState, useCallback } from "react";
import { useMenu, useCartSummary } from "@/app/features/store";
import { DishCard } from "@/app/features/menu/components/DishCard";
import { DishModal } from "@/app/features/menu/components/DishModal";
import type { MenuItem } from "@/app/domain/menu";
import { formatMoney } from "@/app/domain/common";
import LanguageToggle from "@/app/ui/components/LanguageToggle";
import ThemeToggle from "@/app/ui/components/ThemeToggle";
import CartDrawer from "@/app/features/cart/components/CartDrawer";
import CollapsibleSection from "@/app/features/menu/components/CollapsibleSection";
import "./MenuPage.css";

export default function MenuPage() {
  const categories = useMenu();
  const sortedCats = useMemo(() => [...categories].sort((a, b) => a.sort - b.sort), [categories]);
  const { totalCents, totalQty } = useCartSummary();

  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Track open/closed sections as a Set of IDs
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="menuPage">
      <header className="menuPage__header">
        <h1 className="menuPage__title">Menu</h1>
        <div className="menuPage__actions">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Collapsible sections with on-demand items */}
      <div style={{ display: "grid", gap: 12 }}>
        {sortedCats.map(cat => (
          <CollapsibleSection<MenuItem>
            key={cat.id}
            id={cat.id}
            title={cat.name}
            count={cat.items.length}
            open={openSet.has(cat.id)}
            onToggle={toggle}
            items={cat.items}
            batchSize={8} // tweak if needed
            getKey={(it) => it.id}
            renderItem={(it) => (
              <DishCard item={it} onOpen={setModalItem} />
            )}
          />
        ))}
      </div>

      {modalItem && <DishModal item={modalItem} onClose={() => setModalItem(null)} />}

      {/* Sticky bottom bar with 🛒 */}
      <div className="menuPage__totalBar">
        <button
          className="cartBtn"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
          title="Open cart"
        >
          🛒 <span className="cartBtn__qty">{totalQty}</span>
        </button>
        <div style={{ fontWeight: 700 }}>{formatMoney(totalCents)}</div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
