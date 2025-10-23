"use client";
import { useI18n } from "@/app/hooks/useI18n"; // adjust path if needed
import "./LanguageToggle.css";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="seg seg--withlabel">
      <button
        className={`seg__btn`}
        aria-pressed={locale === "en"}
        onClick={() => setLocale(locale === "en" ? "pt" : "en")}
      >
        {locale === "en" ? "EN" : "PT"}
      </button>
    </div>
  );
}
