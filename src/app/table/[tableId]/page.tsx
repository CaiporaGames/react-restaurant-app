"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import MenuPage from "@/app/features/menu/pages/MenuPage";
import { useMenuController } from "@/app/features/menu/controllers/useMenuController";

export default function TableMenuPage() 
{
  const params = useParams<{ tableId: string }>();
  const tableCode = Array.isArray(params.tableId) ? params.tableId[0] : params.tableId;

  const { loading, error } = useMenuController(tableCode);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error) return <div style={{ padding: 16, color: "crimson" }}>Error: {error}</div>;

  return <MenuPage />;
}
