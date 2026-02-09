"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

type SavedGara = {
  id: string;
  gara_nome: string;
  gara_data: string;
  gara_distanza: number;
  gara_tipo: string;
  gara_localita: string;
  gara_mese: number;
};

const mesiNomi: Record<number, string> = {
  1: "Gennaio", 2: "Febbraio", 3: "Marzo", 4: "Aprile",
  5: "Maggio", 6: "Giugno", 7: "Luglio", 8: "Agosto",
  9: "Settembre", 10: "Ottobre", 11: "Novembre", 12: "Dicembre",
};

export default function LeMieGare() {
  const { user, loading, supabase } = useAuth();
  const [gare, setGare] = useState<SavedGara[]>([]);
  const [loadingGare, setLoadingGare] = useState(true);

  useEffect(() => {
    if (!user || !supabase) return;
    const load = async () => {
      const { data } = await supabase
        .from("user_gare")
        .select("*")
        .order("gara_mese", { ascending: true });
      if (data) setGare(data);
      setLoadingGare(false);
    };
    load();
  }, [user, supabase]);

  const removeGara = async (gara: SavedGara) => {
    if (!supabase) return;
    await supabase.from("user_gare").delete().eq("id", gara.id);
    setGare((prev) => prev.filter((g) => g.id !== gara.id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
        <main className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Le Mie Gare</h2>
          <p className="text-gray-500 dark:text-gray-400">Effettua il login per vedere le tue gare salvate.</p>
        </main>
      </div>
    );
  }

  const garePerMese = gare.reduce((acc, gara) => {
    if (!acc[gara.gara_mese]) acc[gara.gara_mese] = [];
    acc[gara.gara_mese].push(gara);
    return acc;
  }, {} as Record<number, SavedGara[]>);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Le Mie Gare</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {gare.length} {gare.length === 1 ? "gara selezionata" : "gare selezionate"}
          </span>
        </div>

        {loadingGare ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : gare.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-12 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Nessuna gara salvata</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Vai alla pagina Gare e clicca la stella per salvare le gare che ti interessano.
            </p>
          </div>
        ) : (
          Object.entries(garePerMese)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([mese, gareMese]) => (
              <div key={mese} className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">
                  {mesiNomi[Number(mese)]} 2026
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-emerald-600 dark:bg-emerald-900 text-white">
                        <th className="p-3 text-left">Data</th>
                        <th className="p-3 text-left">Gara</th>
                        <th className="p-3 text-left">Distanza</th>
                        <th className="p-3 text-left">Tipo</th>
                        <th className="p-3 text-left">Località</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {gareMese.map((gara, i) => (
                        <tr key={gara.id} className={`${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"} hover:bg-emerald-50 dark:hover:bg-gray-800 transition-colors`}>
                          <td className="p-3 border-b dark:border-gray-700">{gara.gara_data}</td>
                          <td className="p-3 border-b dark:border-gray-700 font-medium dark:text-gray-100">{gara.gara_nome}</td>
                          <td className="p-3 border-b dark:border-gray-700 dark:text-gray-300">{gara.gara_distanza} km</td>
                          <td className="p-3 border-b dark:border-gray-700">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                gara.gara_tipo === "Trail"
                                  ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                                  : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                              }`}
                            >
                              {gara.gara_tipo}
                            </span>
                          </td>
                          <td className="p-3 border-b dark:border-gray-700 dark:text-gray-300">{gara.gara_localita}</td>
                          <td className="p-3 border-b dark:border-gray-700 text-center">
                            <button
                              onClick={() => removeGara(gara)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Rimuovi dalle mie gare"
                            >
                              &#x2715;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
        )}
      </main>
    </div>
  );
}
