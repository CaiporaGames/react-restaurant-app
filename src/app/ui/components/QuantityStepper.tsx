"use client";
import "@/app/ui/components/QuantityStepper.css";


export function QuantityStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) 
{
    return (
        <div className="qty">
            <button className="qty__btn" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
            <div className="qty__value" aria-live="polite">{value}</div>
            <button className="qty__btn" onClick={() => onChange(value + 1)}>＋</button>
        </div>
    );
}