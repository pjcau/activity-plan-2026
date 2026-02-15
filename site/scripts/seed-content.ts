import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Dati ---

const libri = [
  {
    titolo: "The Plant-Based Athlete",
    sottotitolo: "A Game-Changing Approach to Peak Performance",
    autori: "Matt Frazier & Robert Cheeke",
    anno: 2021,
    descrizione:
      "La guida definitiva per collegare alimentazione plant-based e performance atletica di alto livello. Contiene oltre 60 ricette, interviste con più di 50 atleti professionisti e la scienza dietro i benefici di un'alimentazione 100% vegetale per sport e recupero. New York Times Bestseller.",
    perche: "Base per tutte le 60 ricette nella sezione Ricette del sito.",
    link_amazon:
      "https://www.amazon.it/Plant-based-Athlete-Game-changing-Approach-Performance/dp/0063042010",
    lingua: "Inglese",
    ordine: 1,
  },
  {
    titolo: "Eat & Run",
    sottotitolo:
      "La vita straordinaria di uno dei più grandi ultramaratoneti di tutti i tempi",
    autori: "Scott Jurek & Steve Friedman",
    anno: 2012,
    descrizione:
      "L'autobiografia di Scott Jurek, leggenda dell'ultramaratona e 7 volte vincitore della Western States 100. Alterna storie di gare epiche a riflessioni sulla dieta vegana che ha alimentato le sue imprese, con ricette plant-based alla fine di ogni capitolo. Prefazione di Alex Bellini nell'edizione italiana.",
    perche:
      "Ispirazione per la sezione Alimentazione e i principi nutrizionali del sito.",
    link_amazon:
      "https://www.amazon.it/straordinaria-grandi-ultramaratoneti-tutti-tempi/dp/8893710358",
    lingua: "Italiano",
    ordine: 2,
  },
  {
    titolo: "Finding Ultra",
    sottotitolo:
      "Come ho fermato il tempo, sono diventato uno degli atleti più forti del mondo e ho scoperto me stesso",
    autori: "Rich Roll",
    anno: 2012,
    descrizione:
      "La storia di Rich Roll, che a 40 anni ha trasformato la sua vita da avvocato sovrappeso e alcolista a uno degli atleti di endurance più forti al mondo, completando 5 Ironman in 5 giorni. Include la sua dieta Plantpower e le ricette preferite. Edizione italiana tradotta da Antonio Tozzi.",
    perche:
      "Ispirazione per la sezione Alimentazione e la filosofia plant-based del sito.",
    link_amazon: "https://www.amazon.it/Finding-ultra-Rich-Roll/dp/8893710927",
    lingua: "Italiano",
    ordine: 3,
  },
  {
    titolo: "Andiamo a correre",
    sottotitolo: "La guida completa per chi vuole iniziare o migliorare nella corsa",
    autori: "Fulvio Massini",
    anno: 2016,
    descrizione:
      "La 'bibbia della corsa' italiana. Fulvio Massini, da trent'anni allenatore di maratoneti, svela tecnica, allenamento personalizzato (dal principiante al maratoneta), alimentazione, integratori, prevenzione infortuni e mental training. 336 pagine con esercizi illustrati, capitoli dedicati a donne, giovani e runner over 50. Prefazione di Linus.",
    perche:
      "Riferimento per la sezione Allenamenti e per i consigli tecnici dell'AI Coach.",
    link_amazon:
      "https://www.amazon.it/Andiamo-correre-illustrata-Fulvio-Massini/dp/8817087165",
    lingua: "Italiano",
    ordine: 4,
  },
];

const foodPowerTips = [
  {
    nutriente: "Omega-3 (ALA/DHA)",
    fonti: "Semi di chia, semi di lino macinati, noci, alga spirulina",
    tip: "2 cucchiai di semi di chia al giorno coprono il fabbisogno di ALA. Per il DHA, considera un integratore da alghe.",
    colore: "blue",
    ordine: 1,
  },
  {
    nutriente: "Vitamina B12",
    fonti: "Integratore o alimenti fortificati (latte vegetale, lievito alimentare)",
    tip: "L'unico nutriente che richiede sempre un integratore in una dieta 100% vegetale. 250 mcg/giorno.",
    colore: "red",
    ordine: 2,
  },
  {
    nutriente: "Ferro",
    fonti: "Lenticchie, spinaci, semi di zucca, quinoa, cacao amaro",
    tip: "Abbina sempre con vitamina C (limone, peperoni) per aumentare l'assorbimento fino a 6 volte.",
    colore: "orange",
    ordine: 3,
  },
  {
    nutriente: "Calcio",
    fonti: "Cavolo riccio, broccoli, mandorle, tofu (con solfato di calcio), fichi secchi",
    tip: "Il calcio vegetale ha un tasso di assorbimento spesso superiore a quello del latte vaccino.",
    colore: "gray",
    ordine: 4,
  },
  {
    nutriente: "Proteine complete",
    fonti: "Tofu, tempeh, edamame, quinoa, grano saraceno, mix legumi + cereali",
    tip: "Non serve combinarli nello stesso pasto: basta variare nell'arco della giornata.",
    colore: "emerald",
    ordine: 5,
  },
  {
    nutriente: "Vitamina D",
    fonti: "Esposizione solare (15-20 min/giorno), funghi esposti al sole, integratore D3 vegana",
    tip: "In inverno un integratore di 1000-2000 UI/giorno è raccomandato per chi vive sopra il 40° parallelo.",
    colore: "yellow",
    ordine: 6,
  },
  {
    nutriente: "Zinco",
    fonti: "Semi di zucca, ceci, lenticchie, anacardi, avena",
    tip: "L'ammollo dei legumi e la germinazione aumentano la biodisponibilità dello zinco.",
    colore: "purple",
    ordine: 7,
  },
  {
    nutriente: "Iodio",
    fonti: "Alghe (nori, kelp), sale iodato, patate",
    tip: "Bastano 2 fogli di alga nori alla settimana. Attenzione alla kelp: dosi eccessive possono essere controproducenti.",
    colore: "teal",
    ordine: 8,
  },
];

const capisaldi = [
  {
    titolo: "Carboidrati complessi come base",
    descrizione:
      "Cereali integrali, legumi, patate e frutta forniscono energia sostenuta per gli allenamenti lunghi. I carboidrati sono il carburante primario per la corsa.",
    esempi: ["Avena", "Riso integrale", "Quinoa", "Patate dolci", "Legumi"],
    ordine: 1,
  },
  {
    titolo: "Proteine vegetali complete",
    descrizione:
      "Combinando diverse fonti proteiche vegetali si ottengono tutti gli aminoacidi essenziali necessari per il recupero muscolare.",
    esempi: ["Legumi + cereali", "Tofu", "Tempeh", "Seitan", "Edamame"],
    ordine: 2,
  },
  {
    titolo: "Grassi sani per l'endurance",
    descrizione:
      "I grassi insaturi supportano la salute cardiovascolare e forniscono energia per gli sforzi prolungati.",
    esempi: ["Avocado", "Noci", "Semi di chia", "Semi di lino", "Olio EVO"],
    ordine: 3,
  },
  {
    titolo: "Antiossidanti e recupero",
    descrizione:
      "Frutta e verdura colorate riducono l'infiammazione e accelerano il recupero post-allenamento.",
    esempi: [
      "Frutti di bosco",
      "Verdure a foglia verde",
      "Barbabietole",
      "Ciliegie",
      "Curcuma",
    ],
    ordine: 4,
  },
  {
    titolo: "Idratazione e elettroliti",
    descrizione:
      "Acqua, frutta e verdura ad alto contenuto idrico mantengono l'equilibrio elettrolitico durante gli sforzi.",
    esempi: ["Acqua di cocco", "Anguria", "Cetrioli", "Sedano", "Banane"],
    ordine: 5,
  },
  {
    titolo: "Timing nutrizionale",
    descrizione:
      "Pianificare i pasti in base agli allenamenti: carboidrati prima, proteine dopo, pasti leggeri pre-gara.",
    esempi: [
      "3h prima: pasto completo",
      "1h prima: snack leggero",
      "Post: proteine + carbo",
      "Sera: recupero",
    ],
    ordine: 6,
  },
];

const integrazioni = [
  {
    nome: "Vitamina B12",
    note: "Essenziale, non prodotta da fonti vegetali",
    ordine: 1,
  },
  {
    nome: "Vitamina D",
    note: "Soprattutto in inverno, supporta ossa e immunità",
    ordine: 2,
  },
  {
    nome: "Omega-3 (EPA/DHA)",
    note: "Da alghe, per infiammazione e recupero",
    ordine: 3,
  },
  {
    nome: "Ferro",
    note: "Monitorare i livelli, abbinare a vitamina C",
    ordine: 4,
  },
];

// --- Seed ---

async function seedTable(name: string, data: Record<string, unknown>[]) {
  const { error: delError } = await supabase.from(name).delete().gte("id", 0);
  if (delError) {
    console.error(`  Errore pulizia ${name}:`, delError.message);
    process.exit(1);
  }

  const { error: insError } = await supabase.from(name).insert(data);
  if (insError) {
    console.error(`  Errore inserimento ${name}:`, insError.message);
    process.exit(1);
  }

  console.log(`  [OK] ${name}: ${data.length} righe inserite`);
}

async function main() {
  console.log("=== Seed contenuti su Supabase ===\n");

  await seedTable("libri", libri);
  await seedTable("food_power_tips", foodPowerTips);
  await seedTable("capisaldi", capisaldi);
  await seedTable("integrazioni", integrazioni);

  console.log("\nSeed completato!");
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
