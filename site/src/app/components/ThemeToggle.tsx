"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle() {
  const { theme, isDark, setTheme } = useTheme();

  const cycle = () => {
    const next = theme === "auto" ? "light" : theme === "light" ? "dark" : "auto";
    setTheme(next);
  };

  const icon = theme === "auto" ? (isDark ? "\u{1F319}" : "\u{2600}\uFE0F") : theme === "dark" ? "\u{1F319}" : "\u{2600}\uFE0F";
  const label = theme === "auto" ? "Auto" : theme === "light" ? "Chiaro" : "Scuro";

  return (
    <button
      onClick={cycle}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
      title={`Tema: ${label}`}
    >
      <span className="text-base">{icon}</span>
      <span className="hidden sm:inline text-xs opacity-80">{label}</span>
    </button>
  );
}
