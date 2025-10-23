"use client";

import React, { useRef } from "react";
import "./SearchBar.css";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search dishes…",
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="search" role="search">
      <span className="search__icon" aria-hidden>🔎</span>
      <input
        ref={inputRef}
        className="search__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search dishes"
        autoFocus={autoFocus}
      />
      {value && (
        <button
          className="search__clear"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          title="Clear"
        >
          ×
        </button>
      )}
    </div>
  );
}
