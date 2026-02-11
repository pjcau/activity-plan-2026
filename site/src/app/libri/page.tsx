"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

type Libro = {
  id: number;
  titolo: string;
  sottotitolo: string;
  autori: string;
  anno: number;
  descrizione: string;
  perche: string;
  link_amazon: string;
  lingua: string;
  ordine: number;
};

type FoodPowerTip = {
  id: number;
  nutriente: string;
  fonti: string;
  tip: string;
  colore: string;
  ordine: number;
};

function getTipColors(colore: string) {
  const map: Record<string, { card: string; badge: string }> = {
    blue: { card: "bg-blue-50 text-blue-800 border-blue-200", badge: "bg-blue-100 text-blue-700" },
    red: { card: "bg-red-50 text-red-800 border-red-200", badge: "bg-red-100 text-red-700" },
    orange: { card: "bg-orange-50 text-orange-800 border-orange-200", badge: "bg-orange-100 text-orange-700" },
    gray: { card: "bg-gray-50 text-gray-800 border-gray-200", badge: "bg-gray-200 text-gray-700" },
    emerald: { card: "bg-emerald-50 text-emerald-800 border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
    yellow: { card: "bg-yellow-50 text-yellow-800 border-yellow-200", badge: "bg-yellow-100 text-yellow-700" },
    purple: { card: "bg-purple-50 text-purple-800 border-purple-200", badge: "bg-purple-100 text-purple-700" },
    teal: { card: "bg-teal-50 text-teal-800 border-teal-200", badge: "bg-teal-100 text-teal-700" },
  };
  return map[colore] ?? map.gray;
}

export default function Libri() {
  const { supabase } = useAuth();
  const [libri, setLibri] = useState<Libro[]>([]);
  const [tips, setTips] = useState<FoodPowerTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    const load = async () => {
      const [libriRes, tipsRes] = await Promise.all([
        supabase.from("libri").select("*").order("ordine"),
        supabase.from("food_power_tips").select("*").order("ordine"),
      ]);
      if (libriRes.data) setLibri(libriRes.data as Libro[]);
      if (tipsRes.data) setTips(tipsRes.data as FoodPowerTip[]);
      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Libri Consigliati
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            I 3 libri che hanno ispirato questo progetto e la filosofia
            alimentare plant-based per runner e atleti di endurance.
          </p>
        </div>

        {/* Lista libri */}
        <div className="space-y-6 mb-8">
          {libri.map((libro) => (
            <div
              key={libro.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-colors"
            >
              <div className="p-6">
                {/* Titolo e badge lingua */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {libro.titolo}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 italic">{libro.sottotitolo}</p>
                  </div>
                  <span className="ml-3 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                    {libro.lingua}
                  </span>
                </div>

                {/* Autori e anno */}
                <p className="text-emerald-700 dark:text-emerald-400 font-medium mb-4">
                  {libro.autori}{" "}
                  <span className="text-gray-400 font-normal">
                    ({libro.anno})
                  </span>
                </p>

                {/* Descrizione */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {libro.descrizione}
                </p>

                {/* Perché lo usiamo */}
                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-3 mb-4">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    <span className="font-semibold">Usato nel sito:</span>{" "}
                    {libro.perche}
                  </p>
                </div>

                {/* Link Amazon */}
                <a
                  href={libro.link_amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                >
                  Vedi su Amazon.it &#8599;
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Food Power Tips */}
        {tips.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Food Power Tips
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Consigli dal libro <span className="italic">The Plant-Based Athlete</span> per
              assumere tutti i nutrienti essenziali da fonti vegetali.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((item) => {
                const colors = getTipColors(item.colore);
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-4 ${colors.card}`}
                  >
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${colors.badge}`}
                    >
                      {item.nutriente}
                    </span>
                    <p className="text-sm font-medium mb-1">
                      {item.fonti}
                    </p>
                    <p className="text-xs opacity-80">
                      {item.tip}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-emerald-700 dark:bg-gray-800 text-white rounded-lg shadow-lg p-6 text-center transition-colors">
          <blockquote className="text-xl italic mb-4">
            &quot;The food you eat can be either the safest and most powerful
            form of medicine or the slowest form of poison.&quot;
          </blockquote>
          <cite className="text-emerald-200 dark:text-gray-400">&mdash; Ann Wigmore</cite>
        </div>
      </main>
    </div>
  );
}
