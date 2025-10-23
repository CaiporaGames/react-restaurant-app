"use client";
import React, { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/app/domain/common";
import { useLocale, usePreferencesActions } from "@/app/features/store";

const dict = {
  en: { language: "Language", categories: "Categories", add: "Add", total: "Total", allergens: "Allergens", close: "Close", qty: "Qty" },
  pt: { language: "Idioma",   categories: "Categorias", add: "Adicionar", total: "Total", allergens: "Alergénios", close: "Fechar", qty: "Qtd" },
};
type TKeys = keyof typeof dict.en;

interface I18nCtx {
  locale: Locale;
  t: (k: TKeys) => string;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nCtx | null>(null);

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const locale = useLocale(); // from persisted store
  const { setLocale } = usePreferencesActions();

  const value = useMemo<I18nCtx>(() => ({
    locale,
    t: (k) => dict[locale][k],
    setLocale,
  }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider missing");
  return ctx;
};
