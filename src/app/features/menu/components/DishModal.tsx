"use client";
import React from "react";
import type { MenuItem } from "@/app/domain/menu";
import Button from "@/app/ui/components/Button";
import { useCartActions, useCartLines } from "@/app/features/store";
import { formatMoney } from "@/app/domain/common";
import "@/app/features/menu/components/DishModal.css";


export function DishModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
    const { setQty, add } = useCartActions();
    const qty = useCartLines()[item.id]?.qty ?? 0;
    return (
        <div className="modal">
            <div className="modal__card">
                <button className="modal__close" onClick={onClose}>×</button>
                {item.photo_url && <img className="modal__photo" src={item.photo_url} alt="" />}
                <h2>{item.name_en}</h2>
                {item.description_en && <p className="modal__desc">{item.description_en}</p>}
                {item.allergens?.length ? (
                    <p className="modal__allergens"><strong>Allergens:</strong> {item.allergens.join(", ")}</p>
                ) : null}
                <div className="modal__row">
                    <div className="modal__price">{formatMoney(item.price.priceCents)}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <Button onClick={() => setQty(item, Math.max(0, qty - 1))}>−</Button>
                        <div style={{ minWidth: 28, textAlign: "center", lineHeight: "36px" }}>{qty}</div>
                        <Button onClick={() => setQty(item, qty + 1)}>＋</Button>
                    </div>
                </div>
                <Button onClick={() => { add(item); onClose(); }}>Add to cart</Button>
            </div>
        </div>
    );
}