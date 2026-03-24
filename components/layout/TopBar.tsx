"use client";

import { Bell, Search, Globe, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function TopBar() {
  return (
    <header
      className="flex justify-between items-center w-full px-8 py-3 sticky top-0 z-40"
      style={{
        backgroundColor: "#f8fafc",
        fontFamily: "var(--font-manrope), sans-serif",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div
          className="relative w-full max-w-md"
        >
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--on-surface-variant)" }}
          />
          <Input
            type="text"
            placeholder="Rechercher une transaction..."
            className="w-full text-xs"
            style={{
              backgroundColor: "var(--surface-container-high)",
              border: "none",
              borderRadius: "0.5rem",
              padding: "8px 16px 8px 40px",
            }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="icon" className="relative" style={{ color: "var(--on-surface-variant)" }}>
            <Bell size={20} strokeWidth={1.8} />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full border-2"
              style={{ backgroundColor: "var(--error)", borderColor: "#f8fafc" }}
            />
          </Button>

          {/* Language */}
          <Button variant="icon" style={{ color: "var(--on-surface-variant)" }}>
            <Globe size={20} strokeWidth={1.8} />
          </Button>

          {/* Currency */}
          <Button variant="icon" style={{ color: "var(--on-surface-variant)" }}>
            <RefreshCw size={20} strokeWidth={1.8} />
          </Button>
        </div>

        {/* Divider */}
        <div
          className="h-8 w-px"
          style={{ backgroundColor: "rgba(171,179,183,0.3)" }}
        />

        {/* User profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p
              className="text-xs font-bold leading-none"
              style={{ color: "var(--on-surface)" }}
            >
              Yassine Laroui
            </p>
            <p
              className="font-medium mt-0.5"
              style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}
            >
              Plan Premium
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 border-2"
            style={{
              background: "linear-gradient(135deg, #003f3f 0%, #166969 100%)",
              color: "var(--primary-container)",
              fontFamily: "var(--font-manrope), sans-serif",
              borderColor: "var(--primary-container)",
            }}
          >
            YL
          </div>
        </div>
      </div>
    </header>
  );
}
