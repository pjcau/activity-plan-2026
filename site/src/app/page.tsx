"use client";

import { useState } from "react";
import gareData from "../data/gare.json";

type Fonte = "Calendario Podismo" | "US Nave";

type Gara = {
  data: string;
  nome: string;
  distanza: number;
  tipo: "Trail" | "Strada";
  localita: string;
  mese: number;
  fonti: Fonte[];
};

const gare = gareData.gare as Gara[];
const ultimoAggiornamento = gareData.ultimoAggiornamento;

// Mesi disponibili nei dati (calcolati dinamicamente)
const mesiDisponibili = [...new Set(gare.map((g) => g.mese))].sort((a, b) => a - b);

const mesiNomi: Record<number, string> = {
  1: "Gennaio",
  2: "Febbraio",
  3: "Marzo",
  4: "Aprile",
  5: "Maggio",
  6: "Giugno",
  7: "Luglio",
  8: "Agosto",
  9: "Settembre",
  10: "Ottobre",
  11: "Novembre",
  12: "Dicembre",
};

const fonteBadge: Record<Fonte, { bg: string; text: string; short: string }> = {
  "Calendario Podismo": { bg: "bg-emerald-100", text: "text-emerald-700", short: "CP" },
  "US Nave": { bg: "bg-purple-100", text: "text-purple-700", short: "USN" },
};

function FonteBadge({ fonte }: { fonte: Fonte }) {
  const { bg, text, short } = fonteBadge[fonte];
  return (
    <span className={`${bg} ${text} px-1.5 py-0.5 rounded text-xs font-medium`} title={fonte}>
      {short}
    </span>
  );
}

function GareTable({ gare }: { gare: Gara[] }) {
  if (gare.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nessuna gara trovata con i filtri selezionati
      </div>
    );
  }

  const garePerMese = gare.reduce((acc, gara) => {
    if (!acc[gara.mese]) acc[gara.mese] = [];
    acc[gara.mese].push(gara);
    return acc;
  }, {} as Record<number, Gara[]>);

  return (
    <>
      {Object.entries(garePerMese)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([mese, gareDelMese]) => (
          <div key={mese} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-emerald-600">
              {mesiNomi[Number(mese)]} 2026
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="p-3 text-left">Data</th>
                    <th className="p-3 text-left">Gara</th>
                    <th className="p-3 text-left">Distanza</th>
                    <th className="p-3 text-left">Tipo</th>
                    <th className="p-3 text-left">Località</th>
                    <th className="p-3 text-left">Fonte</th>
                  </tr>
                </thead>
                <tbody>
                  {gareDelMese.map((gara, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 border-b">{gara.data}</td>
                      <td className="p-3 border-b font-medium">{gara.nome}</td>
                      <td className="p-3 border-b">{gara.distanza} km</td>
                      <td className="p-3 border-b">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            gara.tipo === "Trail"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {gara.tipo}
                        </span>
                      </td>
                      <td className="p-3 border-b">{gara.localita}</td>
                      <td className="p-3 border-b">
                        <div className="flex gap-1">
                          {gara.fonti.map((f) => (
                            <FonteBadge key={f} fonte={f} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </>
  );
}

export default function Home() {
  const meseCorrente = new Date().getMonth() + 1;
  const [meseSelezionato, setMeseSelezionato] = useState<number>(meseCorrente);
  const [distanzaMin, setDistanzaMin] = useState<number>(20);
  const [distanzaMax, setDistanzaMax] = useState<number>(80);
  const [fontiAttive, setFontiAttive] = useState<Set<Fonte>>(
    new Set(["Calendario Podismo", "US Nave"])
  );

  const toggleFonte = (fonte: Fonte) => {
    setFontiAttive((prev) => {
      const next = new Set(prev);
      if (next.has(fonte)) {
        if (next.size > 1) next.delete(fonte);
      } else {
        next.add(fonte);
      }
      return next;
    });
  };

  const gareFiltrate = gare.filter((gara) => {
    const matchMese = meseSelezionato === 0 || gara.mese === meseSelezionato;
    const matchDistanza = gara.distanza >= distanzaMin && gara.distanza <= distanzaMax;
    const matchFonte = gara.fonti.some((f) => fontiAttive.has(f));
    return matchMese && matchDistanza && matchFonte;
  });

  const dataAggiornamento = new Date(ultimoAggiornamento).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtri */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Filtro Mese */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mese
              </label>
              <select
                value={meseSelezionato}
                onChange={(e) => setMeseSelezionato(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={0}>Tutti i mesi</option>
                {mesiDisponibili.map((num) => (
                  <option key={num} value={num}>
                    {mesiNomi[num]}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Distanza Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distanza minima: {distanzaMin} km
              </label>
              <input
                type="range"
                min="0"
                max="80"
                value={distanzaMin}
                onChange={(e) => setDistanzaMin(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Filtro Distanza Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distanza massima: {distanzaMax} km
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={distanzaMax}
                onChange={(e) => setDistanzaMax(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Filtro Fonte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonte dati
              </label>
              <div className="flex flex-col gap-2">
                {(Object.keys(fonteBadge) as Fonte[]).map((fonte) => {
                  const active = fontiAttive.has(fonte);
                  const { bg, text } = fonteBadge[fonte];
                  return (
                    <button
                      key={fonte}
                      onClick={() => toggleFonte(fonte)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                        active
                          ? `${bg} ${text} border-current`
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                    >
                      {fonte}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Riepilogo filtri */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-semibold text-emerald-600">{gareFiltrate.length}</span> gare
              {meseSelezionato > 0 && <> di <span className="font-semibold">{mesiNomi[meseSelezionato]}</span></>}
              {" "}tra <span className="font-semibold">{distanzaMin} km</span> e <span className="font-semibold">{distanzaMax} km</span>
            </p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span><span className="font-semibold text-emerald-700">CP</span> = Calendario Podismo</span>
              <span><span className="font-semibold text-purple-700">USN</span> = US Nave</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Ultimo aggiornamento dati: {dataAggiornamento}
          </p>
        </div>

        {/* Tabella Gare */}
        <GareTable gare={gareFiltrate} />
      </main>
    </div>
  );
}
