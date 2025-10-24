"use client";

import "./DueDrawer.css";
import { useDueItemsDetailed, useOrdersDueSummary } from "@/app/features/store";
import { formatMoney } from "@/app/domain/common";

export default function DueDrawer({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const rows = useDueItemsDetailed();
  const { dueCents, currency } = useOrdersDueSummary();

  return (
    <div className={`due ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="due__overlay" onClick={onClose} />
      <aside className="due__panel" role="dialog" aria-label="Due items">
        <header className="due__header">
          <div className="due__title">Already ordered</div>
          <button className="due__close" onClick={onClose}>×</button>
        </header>

        <div className="due__list">
          {rows.length === 0 ? (
            <div className="due__empty">No items placed yet.</div>
          ) : rows.map(r => (
            <div key={r.id} className="due__row">
              {r.photo_url
                ? <img src={r.photo_url} alt="" className="due__img" />
                : <div className="due__img due__img--ph">🍽️</div>
              }
              <div className="due__info">
                <div className="due__name">{r.name}</div>
                <div className="due__meta">× {r.qty}</div>
              </div>
              <div className="due__price">
                {formatMoney(r.subtotalCents, r.currency)}
              </div>
            </div>
          ))}
        </div>

        <footer className="due__footer">
          <div className="due__total">
            <span>Total due</span>
            <strong>{formatMoney(dueCents, currency)}</strong>
          </div>
          <button className="btn btn--primary" onClick={onClose}>Close</button>
        </footer>
      </aside>
    </div>
  );
}
