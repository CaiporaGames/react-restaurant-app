"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useMenu, useCartSummary } from "@/app/features/store";
import { useOrdersDueSummary } from "@/app/features/store"; // <-- import
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

  const { totalCents, totalQty } = useCartSummary();     // current cart total
  const { dueCents, currency: dueCurrency } = useOrdersDueSummary(); // amount already owed

  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
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
            batchSize={8}
            getKey={(it) => it.id}
            renderItem={(it) => <DishCard item={it} onOpen={setModalItem} />}
          />
        ))}
      </div>

      {modalItem && <DishModal item={modalItem} onClose={() => setModalItem(null)} />}

      {/* Sticky bottom bar: cart + Current + Due */}
      <div className="menuPage__totalBar">
        <button
          className="cartBtn"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
          title="Open cart"
        >
          🛒 <span className="cartBtn__qty">{totalQty}</span>
        </button>

        <div className="menuPage__totals">
          <div className="totalBlock">
            <span className="totalBlock__label">Current</span>
            <strong className="totalBlock__value">{formatMoney(totalCents)}</strong>
          </div>

          <div className="totalBlock">
            <span className="totalBlock__label">Due</span>
            <strong className="totalBlock__value">{formatMoney(dueCents, dueCurrency)}</strong>
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
