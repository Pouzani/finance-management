import type { ElementType } from "react";
import {
  Shield, Plane, Home, Car, BookOpen, Laptop, Heart, Star,
  Target, PiggyBank, Banknote, MapPin, GraduationCap, Music,
  ShoppingBag, Gem, Dumbbell, Globe, Baby, Building,
} from "lucide-react";

export type GoalIconDef = {
  icon: ElementType;
  label: string;
  bg: string;
  color: string;
};

export const DEFAULT_ICON_KEY = "target" as const;

export const GOAL_ICONS: Record<string, GoalIconDef> = {
  shield:     { icon: Shield,        label: "Sécurité",      bg: "var(--primary-container)",   color: "var(--on-primary-container)" },
  plane:      { icon: Plane,         label: "Voyage",        bg: "var(--tertiary-container)",  color: "var(--on-tertiary-container)" },
  home:       { icon: Home,          label: "Logement",      bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  car:        { icon: Car,           label: "Voiture",       bg: "#fce7f3",                    color: "#9d174d" },
  book:       { icon: BookOpen,      label: "Études",        bg: "var(--tertiary-container)",  color: "var(--on-tertiary-container)" },
  laptop:     { icon: Laptop,        label: "Tech",          bg: "#ede9fe",                    color: "#5b21b6" },
  heart:      { icon: Heart,         label: "Santé",         bg: "#dcfce7",                    color: "#166534" },
  star:       { icon: Star,          label: "Priorité",      bg: "#fef9c3",                    color: "#854d0e" },
  target:     { icon: Target,        label: "Objectif",      bg: "var(--primary-container)",   color: "var(--on-primary-container)" },
  savings:    { icon: PiggyBank,     label: "Épargne",       bg: "var(--primary-container)",   color: "var(--on-primary-container)" },
  money:      { icon: Banknote,      label: "Finances",      bg: "var(--primary-container)",   color: "var(--on-primary-container)" },
  travel:     { icon: MapPin,        label: "Destination",   bg: "var(--tertiary-container)",  color: "var(--on-tertiary-container)" },
  education:  { icon: GraduationCap, label: "Éducation",     bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  music:      { icon: Music,         label: "Musique",       bg: "#fce7f3",                    color: "#9d174d" },
  shopping:   { icon: ShoppingBag,   label: "Achats",        bg: "var(--tertiary-container)",  color: "var(--on-tertiary-container)" },
  gem:        { icon: Gem,           label: "Luxe",          bg: "#ede9fe",                    color: "#5b21b6" },
  gym:        { icon: Dumbbell,      label: "Sport",         bg: "#dcfce7",                    color: "#166534" },
  world:      { icon: Globe,         label: "International", bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  family:     { icon: Baby,          label: "Famille",       bg: "#fce7f3",                    color: "#9d174d" },
  business:   { icon: Building,      label: "Business",      bg: "var(--primary-container)",   color: "var(--on-primary-container)" },
};

export const DEFAULT_GOAL_ICON: GoalIconDef = {
  icon: Target,
  label: "Objectif",
  bg: "var(--primary-container)",
  color: "var(--on-primary-container)",
};

export function resolveGoalIcon(iconValue: string | undefined): GoalIconDef {
  if (!iconValue) return DEFAULT_GOAL_ICON;
  const lower = iconValue.toLowerCase();
  return GOAL_ICONS[lower] ?? DEFAULT_GOAL_ICON;
}

// Ordered list for the icon picker
export const GOAL_ICON_KEYS = Object.keys(GOAL_ICONS) as (keyof typeof GOAL_ICONS)[];
