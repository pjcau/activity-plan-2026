"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemePref = "auto" | "light" | "dark";

type ThemeContextType = {
  theme: ThemePref;
  isDark: boolean;
  setTheme: (t: ThemePref) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "theme-pref";

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 6 || h >= 20;
}

function loadThemePref(): ThemePref {
  if (typeof window === "undefined") return "auto";
  const saved = localStorage.getItem(STORAGE_KEY) as ThemePref | null;
  return saved && ["auto", "light", "dark"].includes(saved) ? saved : "auto";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePref>(loadThemePref);
  // Tick che forza il ricalcolo di isDark ogni minuto in modalita' auto
  const [, setTick] = useState(0);

  const isDark = theme === "dark" || (theme === "auto" && isNightTime());

  // Applica classe .dark al DOM
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Aggiorna ogni minuto in modalita' auto
  useEffect(() => {
    if (theme !== "auto") return;
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, [theme]);

  const setTheme = (t: ThemePref) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: "auto" as ThemePref, isDark: false, setTheme: () => {} };
  return ctx;
}
