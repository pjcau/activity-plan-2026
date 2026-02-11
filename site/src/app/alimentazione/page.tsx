"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

type Caposaldo = {
  id: number;
  titolo: string;
  descrizione: string;
  esempi: string[];
  ordine: number;
};

type Integrazione = {
  id: number;
  nome: string;
  note: string;
  ordine: number;
};

export default function Alimentazione() {
  const { supabase } = useAuth();
  const [capisaldi, setCapisaldi] = useState<Caposaldo[]>([]);
  const [integrazione, setIntegrazione] = useState<Integrazione[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    const load = async () => {
      const [capRes, intRes] = await Promise.all([
        supabase.from("capisaldi").select("*").order("ordine"),
        supabase.from("integrazioni").select("*").order("ordine"),
      ]);
      if (capRes.data) setCapisaldi(capRes.data as Caposaldo[]);
      if (intRes.data) setIntegrazione(intRes.data as Integrazione[]);
      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Alimentazione Plant-Based per Runner</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Basato sui principi di <span className="font-semibold">&quot;Eat and Run&quot;</span> di Scott Jurek
            e <span className="font-semibold">&quot;Finding Ultra&quot;</span> di Rich Roll - ultramaratoneti
            che hanno dimostrato come un&apos;alimentazione 100% vegetale possa supportare prestazioni di endurance ai massimi livelli.
          </p>
        </div>

        {/* Capisaldi */}
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">I 6 Capisaldi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {capisaldi.map((item, i) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 transition-colors">
              <div className="flex items-center mb-3">
                <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.titolo}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{item.descrizione}</p>
              <div className="flex flex-wrap gap-2">
                {item.esempi.map((esempio, j) => (
                  <span key={j} className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm">
                    {esempio}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Integrazione */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">Integrazione Consigliata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrazione.map((item) => (
              <div key={item.id} className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-emerald-600 mr-3">&#x1F48A;</span>
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{item.nome}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Citazione */}
        <div className="bg-emerald-700 dark:bg-gray-800 text-white rounded-lg shadow-lg p-6 text-center transition-colors">
          <blockquote className="text-xl italic mb-4">
            &quot;Eat clean, train dirty, and run free.&quot;
          </blockquote>
          <cite className="text-emerald-200 dark:text-gray-400">&mdash; Scott Jurek, Eat and Run</cite>
        </div>
      </main>
    </div>
  );
}
