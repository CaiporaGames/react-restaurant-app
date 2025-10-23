"use client";
import React, { useState } from "react";
import { useMenu, useCartSummary } from "@/app/features/store";
import { DishCard } from "@/app/features/menu/components/DishCard";
import { DishModal } from "@/app/features/menu/components/DishModal";
import type { MenuItem } from "@/app/domain/menu";
import { formatMoney } from "@/app/domain/common";
import LanguageToggle from "@/app/ui/components/LanguageToggle";
import ThemeToggle from "@/app/ui/components/ThemeToggle";
import CartDrawer from "@/app/features/cart/components/CartDrawer";
import "./MenuPage.css";

export default function MenuPage() {
  const categories = useMenu();
  const { totalCents, totalQty } = useCartSummary();
  const [open, setOpen] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="menuPage">
      <header className="menuPage__header">
        <h1 className="menuPage__title">Menu</h1>
        <div className="menuPage__actions">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {categories.sort((a,b) => a.sort - b.sort).map(cat => (
        <section key={cat.id} className="menuPage__section">
          <h2 className="menuPage__sectionTitle">{cat.name}</h2>
          <div className="menuPage__grid">
            {cat.items.map(it => (
              <DishCard key={it.id} item={it} onOpen={setOpen} />
            ))}
          </div>
        </section>
      ))}

      {open && <DishModal item={open} onClose={() => setOpen(null)} />}

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
