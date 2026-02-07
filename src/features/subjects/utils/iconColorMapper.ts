import {
  BookOpen,
  Microscope,
  Beaker,
  Calculator,
  Globe,
  Brain,
  Atom,
  Languages,
  Palette,
  Music,
  Laptop,
  ScrollText,
  Trophy,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import type { SubjectIcon, SubjectColor } from "../types/subject.types";

// =============================================
// Icon Mapping
// =============================================

const ICON_MAP: Record<SubjectIcon, LucideIcon> = {
  book: BookOpen,
  microscope: Microscope,
  flask: Beaker,
  calculator: Calculator,
  globe: Globe,
  brain: Brain,
  atom: Atom,
  dna: Brain,
  language: Languages,
  palette: Palette,
  music: Music,
  laptop: Laptop,
  scroll: ScrollText,
  trophy: Trophy,
  rocket: Rocket,
};

/**
 * Get the Lucide icon component for a subject icon name
 */
export function getSubjectIcon(icon: SubjectIcon): LucideIcon {
  return ICON_MAP[icon] || BookOpen;
}

// =============================================
// Color Mapping
// =============================================

interface ColorClasses {
  bg: string;
  bgGradient: string;
  border: string;
  text: string;
  badge: string;
  progressBar: string;
}

const COLOR_MAP: Record<SubjectColor, ColorClasses> = {
  blue: {
    bg: "bg-[#0D7377]/5",
    bgGradient: "bg-linear-to-r from-[#0D7377]/5 via-[#0D7377]/10 to-[#0D7377]/5",
    border: "border-[#0D7377]/20",
    text: "text-[#0D7377]",
    badge: "bg-[#0D7377]/10 text-[#0D7377]/90",
    progressBar: "bg-[#0D7377]",
  },
  green: {
    bg: "bg-[#6A994E]/5",
    bgGradient: "bg-linear-to-r from-[#6A994E]/5 via-[#6A994E]/10 to-[#6A994E]/5",
    border: "border-[#6A994E]/20",
    text: "text-[#4A7C59]",
    badge: "bg-[#6A994E]/10 text-[#4A7C59]",
    progressBar: "bg-[#4A7C59]",
  },
  purple: {
    bg: "bg-[#0D7377]/5",
    bgGradient: "bg-linear-to-r from-[#0D7377]/5 via-[#0D7377]/10 to-[#0D7377]/5",
    border: "border-[#0D7377]/20",
    text: "text-[#0D7377]",
    badge: "bg-[#0D7377]/10 text-[#0D7377]/90",
    progressBar: "bg-[#0D7377]",
  },
  red: {
    bg: "bg-red-50",
    bgGradient: "bg-linear-to-r from-red-50 via-red-100 to-red-50",
    border: "border-red-200",
    text: "text-red-600",
    badge: "bg-red-100 text-red-700",
    progressBar: "bg-red-600",
  },
  amber: {
    bg: "bg-amber-50",
    bgGradient: "bg-linear-to-r from-amber-50 via-amber-100 to-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    progressBar: "bg-amber-600",
  },
  pink: {
    bg: "bg-pink-50",
    bgGradient: "bg-linear-to-r from-pink-50 via-pink-100 to-pink-50",
    border: "border-pink-200",
    text: "text-pink-600",
    badge: "bg-pink-100 text-pink-700",
    progressBar: "bg-pink-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    bgGradient: "bg-linear-to-r from-cyan-50 via-cyan-100 to-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-600",
    badge: "bg-cyan-100 text-cyan-700",
    progressBar: "bg-cyan-600",
  },
  indigo: {
    bg: "bg-[#4A7C59]/5",
    bgGradient: "bg-linear-to-r from-[#4A7C59]/5 via-[#4A7C59]/10 to-[#4A7C59]/5",
    border: "border-[#4A7C59]/20",
    text: "text-[#4A7C59]",
    badge: "bg-[#4A7C59]/10 text-[#4A7C59]/90",
    progressBar: "bg-[#4A7C59]",
  },
  emerald: {
    bg: "bg-[#6A994E]/5",
    bgGradient: "bg-linear-to-r from-[#6A994E]/5 via-[#6A994E]/10 to-[#6A994E]/5",
    border: "border-[#6A994E]/20",
    text: "text-[#4A7C59]",
    badge: "bg-[#6A994E]/10 text-[#4A7C59]",
    progressBar: "bg-[#4A7C59]",
  },
  rose: {
    bg: "bg-rose-50",
    bgGradient: "bg-linear-to-r from-rose-50 via-rose-100 to-rose-50",
    border: "border-rose-200",
    text: "text-rose-600",
    badge: "bg-rose-100 text-rose-700",
    progressBar: "bg-rose-600",
  },
  violet: {
    bg: "bg-[#4A7C59]/5",
    bgGradient: "bg-linear-to-r from-[#4A7C59]/5 via-[#4A7C59]/10 to-[#4A7C59]/5",
    border: "border-[#4A7C59]/20",
    text: "text-[#4A7C59]",
    badge: "bg-[#4A7C59]/10 text-[#4A7C59]/90",
    progressBar: "bg-[#4A7C59]",
  },
  teal: {
    bg: "bg-teal-50",
    bgGradient: "bg-linear-to-r from-teal-50 via-teal-100 to-teal-50",
    border: "border-teal-200",
    text: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
    progressBar: "bg-teal-600",
  },
  orange: {
    bg: "bg-orange-50",
    bgGradient: "bg-linear-to-r from-orange-50 via-orange-100 to-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    progressBar: "bg-orange-600",
  },
  lime: {
    bg: "bg-lime-50",
    bgGradient: "bg-linear-to-r from-lime-50 via-lime-100 to-lime-50",
    border: "border-lime-200",
    text: "text-lime-600",
    badge: "bg-lime-100 text-lime-700",
    progressBar: "bg-lime-600",
  },
  fuchsia: {
    bg: "bg-fuchsia-50",
    bgGradient: "bg-linear-to-r from-fuchsia-50 via-fuchsia-100 to-fuchsia-50",
    border: "border-fuchsia-200",
    text: "text-fuchsia-600",
    badge: "bg-fuchsia-100 text-fuchsia-700",
    progressBar: "bg-fuchsia-600",
  },
};

/**
 * Get the Tailwind color classes for a subject color
 */
export function getSubjectColorClasses(color: SubjectColor): ColorClasses {
  return COLOR_MAP[color] || COLOR_MAP.blue;
}
