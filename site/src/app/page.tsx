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

// Coordinate Firenze
const FIRENZE = { lat: 43.7696, lon: 11.2558 };

// Coordinate localita toscane (lat, lon)
const coordLocalita: Record<string, { lat: number; lon: number }> = {
  "Firenze": { lat: 43.7696, lon: 11.2558 },
  "Montalcino": { lat: 43.0588, lon: 11.4908 },
  "Agliana": { lat: 43.9042, lon: 11.0069 },
  "Sesto Fiorentino": { lat: 43.8325, lon: 11.2000 },
  "Palazzuolo sul Senio": { lat: 44.1125, lon: 11.5467 },
  "Venturina Terme": { lat: 43.0267, lon: 10.6033 },
  "Scandicci": { lat: 43.7536, lon: 11.1892 },
  "Castelnuovo Berardenga": { lat: 43.3467, lon: 11.5042 },
  "Borgo San Lorenzo": { lat: 43.9542, lon: 11.3867 },
  "Grosseto": { lat: 42.7633, lon: 11.1133 },
  "Castiglione della Pescaia": { lat: 42.7642, lon: 10.8833 },
  "Pisa": { lat: 43.7228, lon: 10.4017 },
  "Pitigliano": { lat: 42.6347, lon: 11.6703 },
  "Tavarnelle": { lat: 43.5567, lon: 11.1733 },
  "Abbadia San Salvatore": { lat: 42.8817, lon: 11.6775 },
  "Asciano": { lat: 43.2342, lon: 11.5600 },
  "Lucca": { lat: 43.8429, lon: 10.5027 },
  "Calci": { lat: 43.7250, lon: 10.5150 },
  "Castelnuovo di Garfagnana": { lat: 44.1108, lon: 10.4117 },
  "Scarperia": { lat: 43.9942, lon: 11.3547 },
  "Empoli": { lat: 43.7192, lon: 10.9458 },
  "Greve in Chianti": { lat: 43.5833, lon: 11.3167 },
  "Lastra a Signa": { lat: 43.7700, lon: 11.1050 },
  "Siena": { lat: 43.3188, lon: 11.3308 },
  "Arezzo": { lat: 43.4633, lon: 11.8797 },
  "Pistoia": { lat: 43.9333, lon: 10.9167 },
  "Prato": { lat: 43.8808, lon: 11.0967 },
  "Livorno": { lat: 43.5500, lon: 10.3167 },
  "Massa": { lat: 44.0342, lon: 10.1392 },
  "Carrara": { lat: 44.0792, lon: 10.0997 },
  "Volterra": { lat: 43.4008, lon: 10.8606 },
  "San Gimignano": { lat: 43.4678, lon: 11.0433 },
  "Cortona": { lat: 43.2756, lon: 11.9858 },
  "Montepulciano": { lat: 43.0992, lon: 11.7836 },
  "Chiusi": { lat: 43.0167, lon: 11.9500 },
  "Pienza": { lat: 43.0767, lon: 11.6789 },
  "Orbetello": { lat: 42.4400, lon: 11.2133 },
  "Porto Ercole": { lat: 42.3953, lon: 11.2061 },
  "Pietrasanta": { lat: 43.9592, lon: 10.2275 },
  "Seravezza": { lat: 43.9933, lon: 10.2283 },
  "Poppi": { lat: 43.7200, lon: 11.7633 },
  "Massa Marittima": { lat: 43.0500, lon: 10.8917 },
  "Portoferraio": { lat: 42.8147, lon: 10.3192 },
  "Loro Ciuffenna": { lat: 43.5928, lon: 11.6297 },
  "Santa Fiora": { lat: 42.8317, lon: 11.5850 },
  "Fiesole": { lat: 43.8064, lon: 11.2942 },
  "Abetone": { lat: 44.1483, lon: 10.6600 },
  "Pontremoli": { lat: 44.3758, lon: 9.8789 },
  "Minucciano": { lat: 44.1700, lon: 10.2083 },
  "Cetona": { lat: 42.9617, lon: 11.8000 },
  "Monticiano": { lat: 43.1333, lon: 11.1833 },
  "Donoratico": { lat: 43.1267, lon: 10.5967 },
  "Montevarchi": { lat: 43.5231, lon: 11.5697 },
  "Buonconvento": { lat: 43.1333, lon: 11.4833 },
  "Poggibonsi": { lat: 43.4667, lon: 11.1500 },
  "Radda in Chianti": { lat: 43.4867, lon: 11.3733 },
  "Lido di Camaiore": { lat: 43.9167, lon: 10.2500 },
};

// Haversine: distanza in km tra due coordinate
function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Calcola distanza da Firenze per ogni localita (cache)
const distanzaDaFirenze: Record<string, number> = {};
for (const [nome, coord] of Object.entries(coordLocalita)) {
  distanzaDaFirenze[nome] = Math.round(haversineKm(FIRENZE, coord));
}

function getDistanzaDaFirenze(localita: string): number | null {
  return distanzaDaFirenze[localita] ?? null;
}

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
                    <th className="p-3 text-left">Da FI</th>
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
                      <td className="p-3 border-b text-sm text-gray-500">
                        {getDistanzaDaFirenze(gara.localita) !== null
                          ? `${getDistanzaDaFirenze(gara.localita)} km`
                          : "—"}
                      </td>
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
  const [meseSelezionato, setMeseSelezionato] = useState<number>(() => new Date().getMonth() + 1);
  const [mounted] = useState(() => typeof window !== "undefined");
  const [distanzaMin, setDistanzaMin] = useState<number>(20);
  const [distanzaMax, setDistanzaMax] = useState<number>(80);
  const [maxDistDaFirenze, setMaxDistDaFirenze] = useState<number>(150);
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
    const distFi = getDistanzaDaFirenze(gara.localita);
    const matchDistFirenze = distFi === null || distFi <= maxDistDaFirenze;
    return matchMese && matchDistanza && matchFonte && matchDistFirenze;
  });

  const dataAggiornamento = mounted
    ? new Date(ultimoAggiornamento).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtri */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

            {/* Filtro Distanza da Firenze */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max da Firenze: {maxDistDaFirenze} km
              </label>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={maxDistDaFirenze}
                onChange={(e) => setMaxDistDaFirenze(Number(e.target.value))}
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
              {" "}entro <span className="font-semibold">{maxDistDaFirenze} km</span> da Firenze
            </p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span><span className="font-semibold text-emerald-700">CP</span> = Calendario Podismo</span>
              <span><span className="font-semibold text-purple-700">USN</span> = US Nave</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400" suppressHydrationWarning>
            Ultimo aggiornamento dati: {dataAggiornamento}
          </p>
        </div>

        {/* Tabella Gare */}
        <GareTable gare={gareFiltrate} />
      </main>
    </div>
  );
}
