"use client";
import { useThemeMode, usePreferencesActions } from "@/app/features/store"; // adjust path if needed
import "./ThemeToggle.css";

export default function ThemeToggle() 
{
  const mode = useThemeMode();
  const { setThemeMode } = usePreferencesActions();

  // single button toggles between light/dark
  const toggleLightDark = () => setThemeMode(mode === "dark" ? "light" : "dark");

  return (
    <div className="seg">
      <button
        className={`seg__btn`}
        onClick={toggleLightDark}>
        {mode === "dark" ? "☀️" : "🌒"}
      </button>
    </div>
  );
}
