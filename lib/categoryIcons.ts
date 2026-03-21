import {
  ShoppingCart, Banknote, Car, Coffee, Heart, TrendingUp, PiggyBank,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  Revenus:         { icon: Banknote,     bg: "var(--primary-container)",   color: "var(--on-primary-container)" },
  Alimentation:    { icon: ShoppingCart, bg: "var(--tertiary-container)",  color: "var(--on-tertiary-container)" },
  Logement:        { icon: Coffee,       bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  Transport:       { icon: Car,          bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  Loisirs:         { icon: Coffee,       bg: "#fce7f3",                    color: "#9d174d" },
  Santé:           { icon: Heart,        bg: "#dcfce7",                    color: "#166534" },
  Épargne:         { icon: PiggyBank,    bg: "var(--tertiary-container)",  color: "var(--on-tertiary-container)" },
  Investissements: { icon: TrendingUp,   bg: "var(--primary-container)",   color: "var(--on-primary-container)" },
};

export const DEFAULT_ICON: { icon: React.ElementType; bg: string; color: string } = {
  icon: Coffee,
  bg: "var(--surface-container)",
  color: "var(--on-surface-variant)",
};
