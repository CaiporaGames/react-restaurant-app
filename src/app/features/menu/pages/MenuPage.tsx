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
import SearchBar from "@/app/ui/components/SearchBar";
import { useI18n } from "@/app/hooks/useI18n";
import DueDrawer from "@/app/features/orders/components/DueDrawer";

const normalize = (s: string) =>
  (s || "")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export default function MenuPage() 
{
  const [dueOpen, setDueOpen] = useState(false);
  const { locale } = useI18n();
  const categories = useMenu();
  const sortedCats = useMemo(() => [...categories].sort((a, b) => a.sort - b.sort), [categories]);

  // Totals
  const { totalCents, totalQty } = useCartSummary();          // current cart
  const { dueCents, currency: dueCurrency } = useOrdersDueSummary(); // placed orders

  // Search
  const [q, setQ] = useState("");
  const qn = normalize(q);
  const isSearching = qn.length > 0;

  // Filter items per category by name (both en/pt for safety)
  const filteredCats = useMemo(() => {
    if (!isSearching) return sortedCats;
    return sortedCats
      .map((cat) => {
        const items = cat.items.filter((it) => {
          const a = normalize(it.name_en);
          const b = normalize((it as any).name_pt ?? "");
          return a.includes(qn) || b.includes(qn);
        });
        return { ...cat, items };
      })
      .filter((c) => c.items.length > 0);
  }, [sortedCats, isSearching, qn]);

  // Collapsible open state (when searching, auto-open all)
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const toggle = useCallback((id: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const placeholder = locale === "pt" ? "Procurar pratos…" : "Search dishes…";

  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="menuPage">
      <header className="menuPage__header">
        <h1 className="menuPage__title">Alentejo</h1>
        <div className="menuPage__actions">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Search bar */}
      <div className="menuPage__search">
        <SearchBar value={q} onChange={setQ} placeholder={placeholder} />
      </div>

      {/* Collapsible sections (show only matches while searching) */}
      <div style={{ display: "grid", gap: 12 }}>
        {filteredCats.map((cat) => (
          <CollapsibleSection<MenuItem>
            key={cat.id}
            id={cat.id}
            title={cat.name}
            count={isSearching ? cat.items.length : cat.items.length}
            open={isSearching ? true : openSet.has(cat.id)}  // auto-open when searching
            onToggle={toggle}
            items={cat.items}
            batchSize={12}
            getKey={(it) => it.id}
            renderItem={(it) => <DishCard item={it} onOpen={setModalItem} />}
          />
        ))}
        {isSearching && filteredCats.length === 0 && (
          <div style={{ color: "var(--muted)", padding: 12 }}>
            {locale === "pt" ? "Sem resultados." : "No results."}
          </div>
        )}
      </div>

      {modalItem && <DishModal item={modalItem} onClose={() => setModalItem(null)} />}

      {/* Sticky bottom bar: 🛒 + Current + Due */}
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
            <span className="totalBlock__label">{locale === "pt" ? "Atual" : "Current"}</span>
            <strong className="totalBlock__value">{formatMoney(totalCents)}</strong>
          </div>
      {/*     <div className="totalBlock">
            <span className="totalBlock__label">{locale === "pt" ? "Em dívida" : "Due"}</span>
            <strong className="totalBlock__value">{formatMoney(dueCents, dueCurrency)}</strong>
          </div> */}

           {/* Make Due clickable */}
          <button
            className="totalBlock totalBlock--button"
            onClick={() => setDueOpen(true)}
            aria-label={locale === "pt" ? "Ver itens já pedidos" : "View already ordered items"}
            title={locale === "pt" ? "Ver itens já pedidos" : "View already ordered items"}
          >
            <span className="totalBlock__label">{locale === "pt" ? "Em dívida" : "Due"}</span>
            <strong className="totalBlock__value">{formatMoney(dueCents, dueCurrency)}</strong>
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <DueDrawer open={dueOpen} onClose={() => setDueOpen(false)} />
    </div>
  );
}