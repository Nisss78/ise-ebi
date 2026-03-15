export type Theme = {
  name: string;
  bgColor: string;
  textColor: string;
  cardBg: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
};

export const themes: Record<string, Theme> = {
  default: {
    name: "デフォルト",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-900",
    cardBg: "bg-white",
    accentColor: "bg-indigo-600",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-purple-600",
  },
  ocean: {
    name: "オーシャン",
    bgColor: "bg-blue-50",
    textColor: "text-blue-900",
    cardBg: "bg-white",
    accentColor: "bg-blue-600",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-600",
  },
  sunset: {
    name: "サンセット",
    bgColor: "bg-orange-50",
    textColor: "text-orange-900",
    cardBg: "bg-white",
    accentColor: "bg-orange-500",
    gradientFrom: "from-orange-400",
    gradientTo: "to-rose-500",
  },
  sakura: {
    name: "サクラ",
    bgColor: "bg-pink-50",
    textColor: "text-pink-900",
    cardBg: "bg-white",
    accentColor: "bg-pink-500",
    gradientFrom: "from-pink-400",
    gradientTo: "to-rose-400",
  },
  dark: {
    name: "ダーク",
    bgColor: "bg-slate-900",
    textColor: "text-slate-100",
    cardBg: "bg-slate-800",
    accentColor: "bg-slate-600",
    gradientFrom: "from-slate-700",
    gradientTo: "to-gray-800",
  },
};

export function getTheme(themeName?: string | null): Theme {
  if (themeName && themes[themeName]) {
    return themes[themeName];
  }
  return themes.default;
}
