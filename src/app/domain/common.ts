export type Locale = "en" | "pt";
export type MoneyCents = number;

export const formatMoney = (
  cents: MoneyCents,
  currency = "EUR",
  locale = "en-US"
) => new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
