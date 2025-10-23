"use client";
import React from "react";
import type { MenuItem } from "@/app/domain/menu";
import { QuantityStepper } from "@/app/ui/components/QuantityStepper";
import { useCartActions, useCartLines } from "@/app/features/store";
import { formatMoney } from "@/app/domain/common";
import "@/app/features/menu/components/DishCard.css";


export function DishCard({ item, onOpen }: { item: MenuItem; onOpen: (i: MenuItem) => void }) 
{
    const lines = useCartLines();
    const { setQty } = useCartActions();
    const qty = lines[item.id]?.qty ?? 0;
    const unit = item.price.priceCents;
    const subtotal = qty * unit;
    return (
        <div className="dish" role="button" onClick={() => onOpen(item)}>
            {item.photo_url && <img className="dish__photo" src={item.photo_url} alt="" />}
            <div className="dish__body">
                <div className="dish__title">{item.name_en}</div>{/* UI text shown in current locale later */}
                <div className="dish__price">
                    {
                        formatMoney(qty > 0 ? subtotal : unit)
                    }
                </div>
                <div className="dish__actions" onClick={e => e.stopPropagation()}>
                    <QuantityStepper value={qty} onChange={(v) => setQty(item, v)} />
                </div>
            </div>
        </div>
    );
}