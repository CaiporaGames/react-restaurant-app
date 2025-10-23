"use client";
import "./CartDrawer.css";
import { useCartDetailed, useCartSummary, useCartActions, useOrderActions } from "@/app/features/store";
import { formatMoney } from "@/app/domain/common";
import { QuantityStepper } from "@/app/ui/components/QuantityStepper";
import ConfirmDialog from "@/app/ui/components/ConfirmDialog";
import { useState } from "react";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rows = useCartDetailed();
  const { totalCents } = useCartSummary();
  const { setQty, clear } = useCartActions();
  const { placeOrder } = useOrderActions();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onOrder = () => setConfirmOpen(true);
  const confirmOrder = () => {
    placeOrder();     // ✅ finalize current cart (cannot cancel)
    setConfirmOpen(false);
    onClose();        // close drawer; new selections start fresh
  };

  return (
    <>
      <div className={`cart ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="cart__overlay" onClick={onClose} />
        <aside className="cart__panel" role="dialog" aria-label="Cart">
          <header className="cart__header">
            <div className="cart__title">Your order</div>
            <button className="cart__close" onClick={onClose}>×</button>
          </header>

          <div className="cart__list">
            {rows.length === 0 ? (
              <div className="cart__empty">Your cart is empty.</div>
            ) : rows.map(r => (
              <div key={r.id} className="cart__row">
                {r.photo_url
                  ? <img src={r.photo_url} alt="" className="cart__img" />
                  : <div className="cart__img cart__img--placeholder">🍽️</div>
                }
                <div className="cart__info">
                  <div className="cart__name">{r.name}</div>
                  <div className="cart__price">{formatMoney(r.priceCents, r.currency)}</div>
                </div>
                <div className="cart__qty">
                  <QuantityStepper value={r.qty} onChange={(v) => setQty(r.itemRef, v)} />
                </div>
                <div className="cart__subtotal">
                  {formatMoney(r.subtotalCents, r.currency)}
                </div>
              </div>
            ))}
          </div>

          <footer className="cart__footer">
            <div className="cart__total">
              <span>Total</span>
              <strong>{formatMoney(totalCents)}</strong>
            </div>
            <div className="cart__actions">
              <button className="btn" onClick={clear}>Clear</button>
              <button
                className="btn btn--primary"
                onClick={onOrder}
                disabled={rows.length === 0}
                title={rows.length === 0 ? "Cart is empty" : "Place order"}
              >
                Order
              </button>
            </div>
          </footer>
        </aside>
      </div>

      {/* ⚠️ Cannot cancel confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Send order to the kitchen?"
        message="Once you confirm, the chef will start cooking. It’s not possible to cancel this order. Continue?"
        confirmText="Yes, send order"
        cancelText="No, go back"
        onConfirm={confirmOrder}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
