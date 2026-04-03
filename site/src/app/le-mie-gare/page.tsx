"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

type SavedGara = {
  id: string;
  gara_id: number | null;
  gara_nome: string;
  gara_data: string;
  gara_distanza: number;
  gara_tipo: string;
  gara_localita: string;
  gara_mese: number;
  iscrizione: string | null;
};

const ISCRIZIONE_OPTIONS = ["NO", "ENDU", "NAVE", "Altro"];

const mesiNomi: Record<number, string> = {
  1: "Gennaio", 2: "Febbraio", 3: "Marzo", 4: "Aprile",
  5: "Maggio", 6: "Giugno", 7: "Luglio", 8: "Agosto",
  9: "Settembre", 10: "Ottobre", 11: "Novembre", 12: "Dicembre",
};

const MESI_SHORT: Record<number, string> = {
  1: "gen", 2: "feb", 3: "mar", 4: "apr", 5: "mag", 6: "giu",
  7: "lug", 8: "ago", 9: "set", 10: "ott", 11: "nov", 12: "dic",
};

export default function LeMieGare() {
  const { user, loading, supabase } = useAuth();
  const [gare, setGare] = useState<SavedGara[]>([]);
  const [loadingGare, setLoadingGare] = useState(true);
  const [garaIdMap, setGaraIdMap] = useState<Record<string, number>>({});
  const [showForm, setShowForm] = useState(false);
  const [formNome, setFormNome] = useState("");
  const [formData, setFormData] = useState("");
  const [formDistanza, setFormDistanza] = useState("");
  const [formTipo, setFormTipo] = useState<"Strada" | "Trail">("Strada");
  const [formLocalita, setFormLocalita] = useState("");
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setFormNome("");
    setFormData("");
    setFormDistanza("");
    setFormTipo("Strada");
    setFormLocalita("");
    setFormError("");
  };

  const handleAddGara = async () => {
    if (!user || !supabase) return;
    if (!formNome.trim() || !formData || !formDistanza || !formLocalita.trim()) {
      setFormError("Compila tutti i campi.");
      return;
    }
    const dist = Number(formDistanza);
    if (isNaN(dist) || dist <= 0) {
      setFormError("Distanza non valida.");
      return;
    }
    const date = new Date(formData);
    const giorno = date.getDate();
    const mese = date.getMonth() + 1;
    const garaData = `${giorno} ${MESI_SHORT[mese]}`;

    setFormSaving(true);
    setFormError("");
    const { data, error } = await supabase.from("user_gare").insert({
      user_id: user.id,
      gara_nome: formNome.trim(),
      gara_data: garaData,
      gara_distanza: dist,
      gara_tipo: formTipo,
      gara_localita: formLocalita.trim(),
      gara_mese: mese,
    }).select().single();
    setFormSaving(false);

    if (error) {
      console.error("Errore salvataggio gara manuale:", error);
      setFormError("Errore nel salvataggio. Riprova.");
      return;
    }
    if (data) setGare((prev) => [...prev, data].sort((a, b) => a.gara_mese - b.gara_mese));
    resetForm();
    setShowForm(false);
  };

  useEffect(() => {
    if (!user || !supabase) return;
    const load = async () => {
      const { data } = await supabase
        .from("user_gare")
        .select("*")
        .order("gara_mese", { ascending: true });
      if (data) {
        setGare(data);
        // For rows missing gara_id, look up from gare table
        const missing = data.filter((g: SavedGara) => !g.gara_id);
        if (missing.length > 0) {
          const names = missing.map((g: SavedGara) => g.gara_nome);
          const { data: found } = await supabase
            .from("gare")
            .select("id, nome, data")
            .in("nome", names);
          if (found) {
            const map: Record<string, number> = {};
            for (const g of found) {
              map[`${g.nome}::${g.data}`] = g.id;
            }
            setGaraIdMap(map);
          }
        }
      }
      setLoadingGare(false);
    };
    load();
  }, [user, supabase]);

  const removeGara = async (gara: SavedGara) => {
    if (!supabase) return;
    await supabase.from("user_gare").delete().eq("id", gara.id);
    setGare((prev) => prev.filter((g) => g.id !== gara.id));
  };

  const updateIscrizione = async (gara: SavedGara, value: string) => {
    if (!supabase) return;
    await supabase.from("user_gare").update({ iscrizione: value }).eq("id", gara.id);
    setGare((prev) => prev.map((g) => g.id === gara.id ? { ...g, iscrizione: value } : g));
  };

  const getGaraLink = (gara: SavedGara): string | null => {
    const id = gara.gara_id || garaIdMap[`${gara.gara_nome}::${gara.gara_data}`];
    return id ? `/gare/${id}` : null;
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Le Mie Gare</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {gare.length} {gare.length === 1 ? "gara selezionata" : "gare selezionate"}
            </span>
            <button
              onClick={() => { setShowForm((v) => !v); setFormError(""); }}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {showForm ? "Annulla" : "+ Aggiungi gara"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Aggiungi gara manualmente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome gara *</label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="es. Maratona di Firenze"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data *</label>
                <input
                  type="date"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distanza (km) *</label>
                <input
                  type="number"
                  min="1"
                  value={formDistanza}
                  onChange={(e) => setFormDistanza(e.target.value)}
                  placeholder="es. 42"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                <select
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value as "Strada" | "Trail")}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Strada">Strada</option>
                  <option value="Trail">Trail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Località *</label>
                <input
                  type="text"
                  value={formLocalita}
                  onChange={(e) => setFormLocalita(e.target.value)}
                  placeholder="es. Firenze (FI)"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddGara}
                  disabled={formSaving}
                  className="w-full px-4 py-2 font-medium rounded-md transition-colors bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSaving ? "Salvataggio..." : "Salva gara"}
                </button>
              </div>
            </div>
            {formError && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{formError}</p>
            )}
          </div>
        )}

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
                        <th className="p-3 text-left">Iscrizione</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {gareMese.map((gara, i) => {
                        const link = getGaraLink(gara);
                        return (
                          <tr key={gara.id} className={`${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"} hover:bg-emerald-50 dark:hover:bg-gray-800 transition-colors`}>
                            <td className="p-3 border-b dark:border-gray-700">{gara.gara_data}</td>
                            <td className="p-3 border-b dark:border-gray-700 font-medium dark:text-gray-100">
                              {link ? (
                                <Link href={link} className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                  {gara.gara_nome}
                                </Link>
                              ) : (
                                gara.gara_nome
                              )}
                            </td>
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
                            <td className="p-3 border-b dark:border-gray-700">
                              <select
                                value={gara.iscrizione || "NO"}
                                onChange={(e) => updateIscrizione(gara, e.target.value)}
                                className={`px-2 py-1 rounded text-sm border cursor-pointer ${
                                  (gara.iscrizione || "NO") === "NO"
                                    ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                                    : "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-medium"
                                }`}
                              >
                                {ISCRIZIONE_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
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
                        );
                      })}
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
