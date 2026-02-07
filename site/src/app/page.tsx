"use client";

import { useState } from "react";

type Fonte = "Calendario Podismo" | "US Nave";

type Gara = {
  data: string;
  nome: string;
  distanza: number; // in km
  tipo: "Trail" | "Strada";
  localita: string;
  mese: number; // 1-12
  fonti: Fonte[];
};

const gare: Gara[] = [
  // Febbraio
  { data: "8 feb", nome: "Brunello Crossing", distanza: 45, tipo: "Trail", localita: "Montalcino", mese: 2, fonti: ["Calendario Podismo"] },
  { data: "8 feb", nome: "Maratonina de' 6 Ponti", distanza: 21, tipo: "Strada", localita: "Agliana", mese: 2, fonti: ["Calendario Podismo", "US Nave"] },
  { data: "8 feb", nome: "8 Trofeo BigMat Competitiva", distanza: 21, tipo: "Strada", localita: "Sesto Fiorentino", mese: 2, fonti: ["US Nave"] },
  { data: "15 feb", nome: "Trail del Poggiolo", distanza: 20, tipo: "Trail", localita: "Palazzuolo sul Senio", mese: 2, fonti: ["Calendario Podismo"] },
  { data: "15 feb", nome: "Trail Monte Spinosa", distanza: 20, tipo: "Trail", localita: "Venturina Terme", mese: 2, fonti: ["Calendario Podismo"] },
  { data: "15 feb", nome: "Mezza Maratona Città di Scandicci", distanza: 21, tipo: "Strada", localita: "Scandicci", mese: 2, fonti: ["Calendario Podismo", "US Nave"] },
  { data: "22 feb", nome: "Ecomaratona del Chianti", distanza: 42, tipo: "Trail", localita: "Castelnuovo Berardenga", mese: 2, fonti: ["Calendario Podismo"] },
  { data: "22 feb", nome: "Ultra Trail Mugello", distanza: 75, tipo: "Trail", localita: "Borgo San Lorenzo", mese: 2, fonti: ["Calendario Podismo"] },
  // Marzo
  { data: "1 mar", nome: "Scagliata Trail", distanza: 21, tipo: "Trail", localita: "Grosseto", mese: 3, fonti: ["Calendario Podismo"] },
  { data: "8 mar", nome: "Trail della Maremma", distanza: 50, tipo: "Trail", localita: "Castiglione della Pescaia", mese: 3, fonti: ["Calendario Podismo"] },
  { data: "8 mar", nome: "Maratona di Pisa", distanza: 42, tipo: "Strada", localita: "Pisa", mese: 3, fonti: ["Calendario Podismo"] },
  { data: "15 mar", nome: "Trail delle Vie Cave", distanza: 21, tipo: "Trail", localita: "Pitigliano", mese: 3, fonti: ["Calendario Podismo"] },
  { data: "15 mar", nome: "Maratonina di Tavarnelle", distanza: 21, tipo: "Strada", localita: "Tavarnelle", mese: 3, fonti: ["Calendario Podismo"] },
  { data: "22 mar", nome: "Ultra Amiata Trail", distanza: 80, tipo: "Trail", localita: "Abbadia San Salvatore", mese: 3, fonti: ["Calendario Podismo"] },
  { data: "29 mar", nome: "Trail delle Crete Senesi", distanza: 35, tipo: "Trail", localita: "Asciano", mese: 3, fonti: ["Calendario Podismo"] },
  { data: "29 mar", nome: "Firenze Half Marathon", distanza: 21, tipo: "Strada", localita: "Firenze", mese: 3, fonti: ["US Nave"] },
  // Aprile
  { data: "5 apr", nome: "Ecotrail Firenze", distanza: 60, tipo: "Trail", localita: "Firenze", mese: 4, fonti: ["Calendario Podismo"] },
  { data: "5 apr", nome: "Maratonina di Lucca", distanza: 21, tipo: "Strada", localita: "Lucca", mese: 4, fonti: ["Calendario Podismo"] },
  { data: "12 apr", nome: "Trail del Monte Pisano", distanza: 30, tipo: "Trail", localita: "Calci", mese: 4, fonti: ["Calendario Podismo"] },
  { data: "19 apr", nome: "Ultratrail Garfagnana", distanza: 72, tipo: "Trail", localita: "Castelnuovo di Garfagnana", mese: 4, fonti: ["Calendario Podismo"] },
  { data: "26 apr", nome: "Maratona del Mugello", distanza: 42, tipo: "Strada", localita: "Scarperia", mese: 4, fonti: ["Calendario Podismo"] },
  // Maggio
  { data: "3 mag", nome: "Trail delle Apuane", distanza: 55, tipo: "Trail", localita: "Seravezza", mese: 5, fonti: ["Calendario Podismo"] },
  { data: "10 mag", nome: "Val d'Orcia Ultra Trail", distanza: 68, tipo: "Trail", localita: "Pienza", mese: 5, fonti: ["Calendario Podismo"] },
  { data: "17 mag", nome: "Trail della Versilia", distanza: 40, tipo: "Trail", localita: "Pietrasanta", mese: 5, fonti: ["Calendario Podismo"] },
  { data: "24 mag", nome: "Casentino Forest Trail", distanza: 50, tipo: "Trail", localita: "Poppi", mese: 5, fonti: ["Calendario Podismo"] },
  { data: "31 mag", nome: "Ultra Colline Metallifere", distanza: 78, tipo: "Trail", localita: "Massa Marittima", mese: 5, fonti: ["Calendario Podismo"] },
  // Giugno
  { data: "7 giu", nome: "Trail dell'Isola d'Elba", distanza: 45, tipo: "Trail", localita: "Portoferraio", mese: 6, fonti: ["Calendario Podismo"] },
  { data: "14 giu", nome: "Ultra Pratomagno", distanza: 65, tipo: "Trail", localita: "Loro Ciuffenna", mese: 6, fonti: ["Calendario Podismo"] },
  { data: "21 giu", nome: "Notturna del Monte Amiata", distanza: 35, tipo: "Trail", localita: "Santa Fiora", mese: 6, fonti: ["Calendario Podismo"] },
  { data: "28 giu", nome: "Trail delle Colline Fiorentine", distanza: 28, tipo: "Trail", localita: "Fiesole", mese: 6, fonti: ["Calendario Podismo"] },
  // Luglio
  { data: "5 lug", nome: "Ultra Trail Abetone", distanza: 70, tipo: "Trail", localita: "Abetone", mese: 7, fonti: ["Calendario Podismo"] },
  { data: "12 lug", nome: "Trail della Lunigiana", distanza: 42, tipo: "Trail", localita: "Pontremoli", mese: 7, fonti: ["Calendario Podismo"] },
  { data: "19 lug", nome: "Skyrace del Pisanino", distanza: 25, tipo: "Trail", localita: "Minucciano", mese: 7, fonti: ["Calendario Podismo"] },
  // Agosto
  { data: "2 ago", nome: "Ferragosto Trail", distanza: 30, tipo: "Trail", localita: "Cortona", mese: 8, fonti: ["Calendario Podismo"] },
  { data: "16 ago", nome: "Ultra Monte Argentario", distanza: 55, tipo: "Trail", localita: "Porto Ercole", mese: 8, fonti: ["Calendario Podismo"] },
  { data: "23 ago", nome: "Trail Val di Cecina", distanza: 38, tipo: "Trail", localita: "Volterra", mese: 8, fonti: ["Calendario Podismo"] },
  // Settembre
  { data: "6 set", nome: "Ultra Trail Chianti", distanza: 75, tipo: "Trail", localita: "Radda in Chianti", mese: 9, fonti: ["Calendario Podismo"] },
  { data: "13 set", nome: "Trail del Monte Cetona", distanza: 32, tipo: "Trail", localita: "Cetona", mese: 9, fonti: ["Calendario Podismo"] },
  { data: "20 set", nome: "Maratona di Firenze", distanza: 42, tipo: "Strada", localita: "Firenze", mese: 9, fonti: ["Calendario Podismo"] },
  { data: "27 set", nome: "Trail della Valdichiana", distanza: 48, tipo: "Trail", localita: "Montepulciano", mese: 9, fonti: ["Calendario Podismo"] },
  // Ottobre
  { data: "4 ott", nome: "Ecomaratona della Maremma", distanza: 42, tipo: "Trail", localita: "Orbetello", mese: 10, fonti: ["Calendario Podismo"] },
  { data: "11 ott", nome: "Ultra Val di Merse", distanza: 60, tipo: "Trail", localita: "Monticiano", mese: 10, fonti: ["Calendario Podismo"] },
  { data: "18 ott", nome: "Trail delle Balze", distanza: 35, tipo: "Trail", localita: "Volterra", mese: 10, fonti: ["Calendario Podismo"] },
  { data: "25 ott", nome: "Maratona della Costa degli Etruschi", distanza: 42, tipo: "Strada", localita: "Donoratico", mese: 10, fonti: ["Calendario Podismo"] },
  // Novembre
  { data: "1 nov", nome: "Trail di Ognissanti", distanza: 28, tipo: "Trail", localita: "San Gimignano", mese: 11, fonti: ["Calendario Podismo"] },
  { data: "8 nov", nome: "Ultra Trail Valdarno", distanza: 65, tipo: "Trail", localita: "Montevarchi", mese: 11, fonti: ["Calendario Podismo"] },
  { data: "15 nov", nome: "Trail delle Crete", distanza: 40, tipo: "Trail", localita: "Buonconvento", mese: 11, fonti: ["Calendario Podismo"] },
  { data: "22 nov", nome: "Maratonina di Arezzo", distanza: 21, tipo: "Strada", localita: "Arezzo", mese: 11, fonti: ["Calendario Podismo"] },
  // Dicembre
  { data: "6 dic", nome: "Trail di San Nicola", distanza: 25, tipo: "Trail", localita: "Chiusi", mese: 12, fonti: ["Calendario Podismo"] },
  { data: "13 dic", nome: "Ultra Trail d'Inverno", distanza: 50, tipo: "Trail", localita: "Siena", mese: 12, fonti: ["Calendario Podismo"] },
  { data: "20 dic", nome: "Trail del Solstizio", distanza: 35, tipo: "Trail", localita: "Poggibonsi", mese: 12, fonti: ["Calendario Podismo"] },
];

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
                {Object.entries(mesiNomi).map(([num, nome]) => (
                  <option key={num} value={num}>
                    {nome}
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
            {/* Legenda badge */}
            <div className="flex gap-3 text-xs text-gray-500">
              <span><span className="font-semibold text-emerald-700">CP</span> = Calendario Podismo</span>
              <span><span className="font-semibold text-purple-700">USN</span> = US Nave</span>
            </div>
          </div>
        </div>

        {/* Tabella Gare */}
        <GareTable gare={gareFiltrate} />
      </main>
    </div>
  );
}
