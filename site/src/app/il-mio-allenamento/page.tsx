"use client";

import { useAuth } from "@/lib/AuthContext";

interface Allenamento {
  giorno: string;
  data: string;
  titolo: string;
  durata: string;
  tipo: "salite" | "ritmo" | "rigenerazione" | "lungo" | "fartlek" | "facile" | "attivazione" | "vigilia" | "gara" | "riposo";
  descrizione: string;
  obiettivo: string;
}

interface Settimana {
  numero: number;
  titolo: string;
  dateRange: string;
  allenamenti: Allenamento[];
}

const obiettivo = {
  nome: "Trail 47 km",
  data: "10 Maggio 2026",
  distanza: 47,
  tipo: "Trail" as const,
  nota: "Partendo da una buona base con la mezza recente, 4 settimane di preparazione, 3 giorni feriali da 1 ora e la domenica lunga.",
};

const settimane: Settimana[] = [
  {
    numero: 1,
    titolo: "Base e adattamento",
    dateRange: "14-20 aprile",
    allenamenti: [
      {
        giorno: "Martedi",
        data: "15 apr",
        titolo: "Salite brevi",
        durata: "55 min",
        tipo: "salite",
        descrizione: "15 min riscaldamento corsa lenta, poi 5x1 min in salita a sforzo forte (non sprint), recupero scendendo al trotto. Chiudi con 15 min di corsa facile in piano.",
        obiettivo: "Forza specifica e abitudine alla pendenza",
      },
      {
        giorno: "Giovedi",
        data: "17 apr",
        titolo: "Ritmo e gestione dello sforzo",
        durata: "60 min",
        tipo: "ritmo",
        descrizione: "10 min riscaldamento, poi 3x10 min a ritmo \"comodo ma impegnativo\" (dovresti parlare a fatica), con 2 min di recupero in corsa lenta tra ogni blocco. 10 min di defaticamento.",
        obiettivo: "Imparare a dosare l'intensita per una gara lunga",
      },
      {
        giorno: "Sabato",
        data: "19 apr",
        titolo: "Rigenerazione attiva",
        durata: "40 min",
        tipo: "rigenerazione",
        descrizione: "Corsa lentissima, tutta in scioltezza, su terreno morbido se possibile. Ultimi 10 min dedicati a esercizi di stabilita: affondi, squat a corpo libero, equilibrio su una gamba.",
        obiettivo: "Recupero e prevenzione",
      },
      {
        giorno: "Domenica",
        data: "20 apr",
        titolo: "Riposo completo",
        durata: "-",
        tipo: "riposo",
        descrizione: "Riposo totale. Nessuna attivita.",
        obiettivo: "Recupero",
      },
    ],
  },
  {
    numero: 2,
    titolo: "Settimana chiave",
    dateRange: "21-27 aprile",
    allenamenti: [
      {
        giorno: "Martedi",
        data: "22 apr",
        titolo: "Salite medie",
        durata: "55 min",
        tipo: "salite",
        descrizione: "15 min riscaldamento, poi 6x2 min in salita a sforzo sostenuto. Recupero scendendo con passo controllato (allena anche la discesa, non \"buttarti\" giu). 10 min defaticamento.",
        obiettivo: "Resistenza muscolare in salita e tecnica in discesa",
      },
      {
        giorno: "Giovedi",
        data: "24 apr",
        titolo: "Progressivo",
        durata: "60 min",
        tipo: "ritmo",
        descrizione: "Parti molto piano per 20 min. I 20 min centrali a ritmo medio. Gli ultimi 20 min progressivamente piu veloci, chiudendo a ritmo gara o leggermente sotto.",
        obiettivo: "Simulare la sensazione di spingere su gambe gia stanche",
      },
      {
        giorno: "Sabato",
        data: "26 apr",
        titolo: "Pre-lungo",
        durata: "35-40 min",
        tipo: "facile",
        descrizione: "Corsa facilissima, breve. Prepara lo zaino per il giorno dopo: prova il materiale che userai in gara (scarpe, bastoncini, gilet idrico, gel o barrette).",
        obiettivo: "Preparazione materiale gara",
      },
      {
        giorno: "Domenica",
        data: "27 apr",
        titolo: "LUNGO CHIAVE",
        durata: "3h-3h30",
        tipo: "lungo",
        descrizione: "Percorso con salite e discese, possibilmente su sentiero (~25-30 km). Parti lento, cammina le salite ripide come faresti in gara. Mangia ogni 40-45 min (gel, frutta secca, barretta) e bevi regolarmente. Test generale: prova tutto quello che userai il 10 maggio.",
        obiettivo: "Simulazione gara completa",
      },
    ],
  },
  {
    numero: 3,
    titolo: "Consolidamento e inizio scarico",
    dateRange: "28 apr - 4 maggio",
    allenamenti: [
      {
        giorno: "Martedi",
        data: "29 apr",
        titolo: "Fartlek su sentiero",
        durata: "55 min",
        tipo: "fartlek",
        descrizione: "15 min riscaldamento, poi 4x5 min a ritmo sostenuto alternati a 3 min di corsa lenta. Cerca di farlo su terreno misto (sterrato, sentiero, saliscendi). 10 min defaticamento.",
        obiettivo: "Mantenere la brillantezza senza affaticarti troppo",
      },
      {
        giorno: "Giovedi",
        data: "1 mag",
        titolo: "Corsa facile con allunghi",
        durata: "50 min",
        tipo: "facile",
        descrizione: "40 min di corsa tranquilla. Negli ultimi 10 min inserisci 4-5 allunghi di 15-20 secondi a ritmo vivace (non sprint).",
        obiettivo: "Tenere sveglie le fibre veloci, gambe reattive",
      },
      {
        giorno: "Sabato",
        data: "3 mag",
        titolo: "Rigenerazione",
        durata: "35-40 min",
        tipo: "rigenerazione",
        descrizione: "Corsa lentissima, stretching finale, eventualmente foam roller.",
        obiettivo: "Recupero completo",
      },
      {
        giorno: "Domenica",
        data: "4 mag",
        titolo: "Medio-lungo",
        durata: "2h-2h15",
        tipo: "lungo",
        descrizione: "Ritmo costante e controllato (~18-20 km), leggermente piu lento del ritmo gara. Su sentiero se possibile. Niente eroismi: deve lasciarti fiducioso, non distrutto. Porta alimentazione per testare un'ultima volta.",
        obiettivo: "Ultima uscita lunga, conferma fiducia",
      },
    ],
  },
  {
    numero: 4,
    titolo: "Scarico e gara",
    dateRange: "5-10 maggio",
    allenamenti: [
      {
        giorno: "Martedi",
        data: "6 mag",
        titolo: "Scioltezza",
        durata: "40 min",
        tipo: "facile",
        descrizione: "30 min di corsa facile, 3-4 allunghi brevi. Nessuna intensita.",
        obiettivo: "Mantenere il ritmo cardiaco senza stress muscolare",
      },
      {
        giorno: "Giovedi",
        data: "8 mag",
        titolo: "Attivazione pre-gara",
        durata: "25-30 min",
        tipo: "attivazione",
        descrizione: "15 min di corsa leggera, 3x30 secondi a ritmo gara con recupero ampio. 5 min di defaticamento.",
        obiettivo: "Far sentire al corpo che sa ancora correre",
      },
      {
        giorno: "Sabato",
        data: "9 mag",
        titolo: "Vigilia",
        durata: "15-20 min",
        tipo: "vigilia",
        descrizione: "Camminata o corsetta leggerissima per sciogliere le gambe. Prepara tutto: zaino, pettorale, gel, abbigliamento, meteo. Cena con carboidrati semplici (pasta, riso), niente cibi nuovi.",
        obiettivo: "Preparazione mentale e logistica",
      },
      {
        giorno: "Domenica",
        data: "10 mag",
        titolo: "GARA 47 KM!",
        durata: "Giornata intera",
        tipo: "gara",
        descrizione: "Primi 10 km: trattieniti. Cammina tutte le salite ripide fin dall'inizio. Primo gel entro 45 min, poi ogni 30-40 min. Bevi a ogni ristoro. Usa i bastoncini se la gara lo permette. Dividi mentalmente la gara in 4 blocchi da ~12 km.",
        obiettivo: "FINIRE E GODERSI L'ESPERIENZA!",
      },
    ],
  },
];

const tipoColori: Record<string, string> = {
  salite: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  ritmo: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  rigenerazione: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  lungo: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  fartlek: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  facile: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  attivazione: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  vigilia: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  gara: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  riposo: "bg-gray-100 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700",
};

const tipoLabel: Record<string, string> = {
  salite: "Salite",
  ritmo: "Ritmo",
  rigenerazione: "Rigenerazione",
  lungo: "Lungo",
  fartlek: "Fartlek",
  facile: "Facile",
  attivazione: "Attivazione",
  vigilia: "Vigilia",
  gara: "GARA",
  riposo: "Riposo",
};

function isAllenamentoPassed(data: string): boolean {
  const mesiMap: Record<string, number> = {
    gen: 0, feb: 1, mar: 2, apr: 3, mag: 4, giu: 5,
    lug: 6, ago: 7, set: 8, ott: 9, nov: 10, dic: 11,
  };
  const parts = data.split(" ");
  const giorno = parseInt(parts[0]);
  const mese = mesiMap[parts[1]];
  if (isNaN(giorno) || mese === undefined) return false;
  const allenamentoDate = new Date(2026, mese, giorno);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allenamentoDate < today;
}

function isAllenamentoToday(data: string): boolean {
  const mesiMap: Record<string, number> = {
    gen: 0, feb: 1, mar: 2, apr: 3, mag: 4, giu: 5,
    lug: 6, ago: 7, set: 8, ott: 9, nov: 10, dic: 11,
  };
  const parts = data.split(" ");
  const giorno = parseInt(parts[0]);
  const mese = mesiMap[parts[1]];
  if (isNaN(giorno) || mese === undefined) return false;
  const allenamentoDate = new Date(2026, mese, giorno);
  const today = new Date();
  return (
    allenamentoDate.getDate() === today.getDate() &&
    allenamentoDate.getMonth() === today.getMonth() &&
    allenamentoDate.getFullYear() === today.getFullYear()
  );
}

function getProgressInfo() {
  const allAllenamenti = settimane.flatMap((s) => s.allenamenti);
  const completati = allAllenamenti.filter((a) => isAllenamentoPassed(a.data)).length;
  const totali = allAllenamenti.length;
  return { completati, totali, percentuale: Math.round((completati / totali) * 100) };
}

function getDaysUntilRace(): number {
  const raceDate = new Date(2026, 4, 10);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = raceDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function IlMioAllenamento() {
  const { user, loading } = useAuth();

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
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Il Mio Allenamento</h2>
          <p className="text-gray-500 dark:text-gray-400">Effettua il login per vedere il tuo piano di allenamento.</p>
        </main>
      </div>
    );
  }

  const progress = getProgressInfo();
  const daysLeft = getDaysUntilRace();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Obiettivo */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-800 dark:to-emerald-950 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-emerald-200 text-sm font-medium uppercase tracking-wider mb-1">Obiettivo</p>
              <h1 className="text-3xl font-bold">{obiettivo.nome}</h1>
              <p className="text-emerald-100 mt-1">{obiettivo.data} &middot; {obiettivo.distanza} km &middot; {obiettivo.tipo}</p>
              <p className="text-emerald-200/80 text-sm mt-2 max-w-xl">{obiettivo.nota}</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="text-5xl font-bold tabular-nums">{daysLeft}</div>
              <div className="text-emerald-200 text-sm">giorni alla gara</div>
            </div>
          </div>

          {/* Barra di progresso */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-emerald-200 mb-2">
              <span>{progress.completati}/{progress.totali} allenamenti</span>
              <span>{progress.percentuale}%</span>
            </div>
            <div className="w-full bg-emerald-900/50 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${progress.percentuale}%` }}
              />
            </div>
          </div>
        </div>

        {/* Note gara */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-5 mb-8">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Strategia gara</h3>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
            <li>Primi 10 km: trattieniti, anche se ti senti benissimo</li>
            <li>Cammina tutte le salite ripide fin dall&apos;inizio</li>
            <li>Primo gel/barretta entro 45 min, poi ogni 30-40 min</li>
            <li>Bevi a ogni ristoro, anche piccoli sorsi</li>
            <li>Usa i bastoncini se la gara lo permette</li>
            <li>Dividi mentalmente la gara in 4 blocchi da ~12 km</li>
          </ul>
        </div>

        {/* Settimane */}
        {settimane.map((settimana) => (
          <div key={settimana.numero} className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-bold">
                {settimana.numero}
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {settimana.titolo}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{settimana.dateRange}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settimana.allenamenti.map((allenamento) => {
                const passed = isAllenamentoPassed(allenamento.data);
                const today = isAllenamentoToday(allenamento.data);

                return (
                  <div
                    key={allenamento.data}
                    className={`rounded-lg border p-5 transition-all ${
                      today
                        ? "ring-2 ring-emerald-500 border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-900 shadow-lg"
                        : passed
                        ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60"
                        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {today && (
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              OGGI
                            </span>
                          )}
                          {passed && (
                            <span className="text-gray-400 dark:text-gray-500 text-lg">&#10003;</span>
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {allenamento.giorno} {allenamento.data}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-1">
                          {allenamento.titolo}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded border ${tipoColori[allenamento.tipo]}`}>
                          {tipoLabel[allenamento.tipo]}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{allenamento.durata}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {allenamento.descrizione}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <span className="font-medium">Obiettivo:</span>
                      <span>{allenamento.obiettivo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
