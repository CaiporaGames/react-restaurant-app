"use client";
import React from "react";
import "@/app/ui/components/Button.css";

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
  }
) {
  const { variant = "primary", className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={["btn", `btn--${variant}`, className].join(" ")}
    />
  );
}
