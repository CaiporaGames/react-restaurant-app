"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./CollapsibleSection.css";

/**
 * Generic collapsible section with incremental rendering.
 * - Controlled `open` prop (parent manages which sections are open)
 * - Renders items in batches using IntersectionObserver on a sentinel
 * - Accessible header button (aria-expanded + aria-controls)
 */
export default function CollapsibleSection<T>({
  id,
  title,
  count,
  open,
  onToggle,
  items,
  renderItem,
  batchSize = 8,
  getKey,
}: {
  id: string;
  title: string;
  count: number;
  open: boolean;
  onToggle: (id: string) => void;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  batchSize?: number;
  getKey?: (item: T, index: number) => string | number;
}) {
  const [visible, setVisible] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Compute keys safely (fallback to index)
  const keyOf = useCallback(
    (it: T, idx: number) => getKey?.(it, idx) ?? (it as any)?.id ?? idx,
    [getKey]
  );

  // When the section opens, show the first batch; when it closes, reset to 0
  useEffect(() => {
    if (open) {
      setVisible((v) => (v === 0 ? Math.min(batchSize, items.length) : v));
    } else {
      setVisible(0);
    }
  }, [open, items.length, batchSize]);

  // Observe the sentinel to load more as we scroll
  useEffect(() => {
    if (!open) return;
    if (visible >= items.length) return;

    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Load next batch
        setVisible((prev) => Math.min(prev + batchSize, items.length));
      }
    }, { rootMargin: "200px 0px" }); // preload a bit before reaching the end

    io.observe(el);
    return () => io.disconnect();
  }, [open, visible, items.length, batchSize]);

  return (
    <section className={`coll ${open ? "is-open" : ""}`}>
      <button
        className="coll__header"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        aria-controls={`coll-body-${id}`}
      >
        <span className="coll__title">{title}</span>
        <span className="coll__meta">{count}</span>
        <span className="coll__chev" aria-hidden>▾</span>
      </button>

      <div id={`coll-body-${id}`} className="coll__body" hidden={!open}>
        <div className="coll__grid">
          {items.slice(0, visible).map((it, i) => (
            <React.Fragment key={keyOf(it, i)}>
              {renderItem(it)}
            </React.Fragment>
          ))}
        </div>

        {/* Sentinel that triggers loading next batch */}
        {open && visible < items.length && (
          <div ref={sentinelRef} className="coll__sentinel" />
        )}
      </div>
    </section>
  );
}
