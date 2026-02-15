import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const knowledgeBase = [
  // === NUTRIZIONE PRE-GARA ===
  {
    categoria: "nutrizione",
    domande: [
      "Cosa mangiare prima di una gara?",
      "What to eat before a race?",
      "pasto pre gara",
      "colazione prima di correre",
      "cosa mangio prima di una maratona",
    ],
    risposta:
      "3 ore prima: pasto completo a base di carboidrati complessi (avena, pane integrale, banana). 1 ora prima: snack leggero come una banana o datteri. Evita grassi e fibre in eccesso che rallentano la digestione. Matt Frazier consiglia porridge con banana e burro di mandorle 3h prima.",
    fonte: "The Plant-Based Athlete - Cap. Timing Nutrizionale",
    ordine: 1,
  },
  {
    categoria: "nutrizione",
    domande: [
      "Cosa mangiare dopo una gara?",
      "What to eat after a race?",
      "recupero post gara",
      "post workout nutrition",
      "cosa mangio dopo aver corso",
    ],
    risposta:
      "Entro 30 minuti: carboidrati + proteine in rapporto 3:1 o 4:1. Smoothie con banana, proteine di pisello, frutti di bosco e latte vegetale. Poi pasto completo entro 2 ore: riso integrale/quinoa + legumi + verdure. Scott Jurek usava un frullato di riso integrale, datteri e proteine di canapa.",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 2,
  },
  {
    categoria: "nutrizione",
    domande: [
      "Cosa mangiare durante una ultra?",
      "What to eat during an ultra marathon?",
      "alimentazione durante la gara",
      "nutrition during ultra trail",
      "gel naturali fatti in casa",
    ],
    risposta:
      "Ogni 30-45 minuti: 200-300 calorie da carboidrati semplici. Opzioni plant-based: datteri, gel di chia (semi di chia + acqua di cocco + miele d'agave), patate dolci a pezzetti, banane. Rich Roll usava anche burrito con riso e fagioli nelle ultra lunghe. Alterna solidi e liquidi.",
    fonte: "Finding Ultra - Rich Roll / The Plant-Based Athlete",
    ordine: 3,
  },

  // === PROTEINE ===
  {
    categoria: "nutrizione",
    domande: [
      "Come assumere abbastanza proteine vegetali?",
      "How to get enough plant protein?",
      "proteine vegane per runner",
      "quante proteine servono",
      "fonti proteiche vegetali",
    ],
    risposta:
      "Un runner ha bisogno di 1.2-1.7 g/kg di proteine al giorno. Fonti top: tofu (20g/porzione), tempeh (18g), lenticchie (18g/tazza), edamame (17g), seitan (25g). Non serve combinarli nello stesso pasto: basta variare nell'arco della giornata. Frazier & Cheeke consigliano di distribuire le proteine su 4-5 pasti.",
    fonte: "The Plant-Based Athlete - Cap. Proteine",
    ordine: 4,
  },
  {
    categoria: "nutrizione",
    domande: [
      "Le proteine vegetali sono complete?",
      "Are plant proteins complete?",
      "aminoacidi essenziali vegani",
      "proteine complete senza carne",
    ],
    risposta:
      "Soia (tofu, tempeh, edamame), quinoa e grano saraceno sono proteine complete con tutti gli aminoacidi essenziali. Per le altre fonti, basta combinare legumi + cereali nell'arco della giornata (non necessariamente nello stesso pasto). Il corpo accumula aminoacidi e li combina autonomamente.",
    fonte: "The Plant-Based Athlete - Cap. Proteine",
    ordine: 5,
  },

  // === INTEGRATORI ===
  {
    categoria: "integrazione",
    domande: [
      "Quali integratori prendere con dieta vegana?",
      "What supplements for vegan athletes?",
      "integratori runner vegano",
      "B12 vegana",
      "supplementi plant based",
    ],
    risposta:
      "Essenziali: Vitamina B12 (250 mcg/giorno), Vitamina D (1000-2000 UI in inverno), Omega-3 DHA/EPA da alghe (250mg/giorno). Da monitorare: Ferro (analisi del sangue 2x/anno, abbinare vitamina C per assorbimento), Zinco (semi di zucca, ceci). Frazier e Cheeke li considerano i 4 pilastri dell'integrazione plant-based.",
    fonte: "The Plant-Based Athlete - Cap. Integrazione",
    ordine: 6,
  },
  {
    categoria: "integrazione",
    domande: [
      "Come assumere ferro senza carne?",
      "How to get iron on a plant-based diet?",
      "ferro vegano per runner",
      "anemia runner vegano",
      "ferro e vitamina C",
    ],
    risposta:
      "Fonti: lenticchie, spinaci, semi di zucca, quinoa, cacao amaro. Trucco fondamentale: abbina sempre vitamina C (limone, peperoni, kiwi) che aumenta l'assorbimento fino a 6 volte. Evita tè e caffè vicino ai pasti ricchi di ferro. I runner hanno bisogno di più ferro per l'emolisi da impatto. Controlla la ferritina ogni 6 mesi.",
    fonte: "The Plant-Based Athlete - Cap. Ferro",
    ordine: 7,
  },
  {
    categoria: "integrazione",
    domande: [
      "Omega 3 senza pesce?",
      "Omega 3 without fish?",
      "omega 3 vegani",
      "DHA EPA alghe",
      "semi di chia omega 3",
    ],
    risposta:
      "Semi di chia e semi di lino forniscono ALA (precursore), ma la conversione in DHA/EPA è bassa (5-10%). Per DHA/EPA diretti: integratore da alghe (250-500 mg/giorno). 2 cucchiai di semi di chia al giorno coprono il fabbisogno di ALA. La spirulina è un'altra ottima fonte.",
    fonte: "The Plant-Based Athlete - Cap. Omega-3",
    ordine: 8,
  },
  {
    categoria: "integrazione",
    domande: [
      "Vitamina B12 per vegani?",
      "B12 supplement for vegans?",
      "B12 dosaggio",
      "dove trovo la B12 vegetale",
    ],
    risposta:
      "La B12 è l'unico nutriente che richiede SEMPRE un integratore in una dieta 100% vegetale. Non esistono fonti vegetali affidabili. Dosaggio: 250 mcg/giorno o 2500 mcg/settimana (cianocobalamina). Il lievito alimentare fortificato ne contiene, ma non basta come unica fonte. Controlla i livelli nel sangue annualmente.",
    fonte: "The Plant-Based Athlete - Cap. B12",
    ordine: 9,
  },
  {
    categoria: "integrazione",
    domande: [
      "Vitamina D per runner?",
      "Vitamin D for runners?",
      "vitamina D inverno",
      "vitamina D e ossa",
    ],
    risposta:
      "15-20 minuti di sole al giorno sono sufficienti in estate. In inverno (ottobre-marzo) sopra il 40° parallelo: integratore D3 vegana (da licheni) 1000-2000 UI/giorno. La vitamina D supporta ossa, sistema immunitario e recupero muscolare. I funghi esposti al sole sono una fonte alimentare.",
    fonte: "The Plant-Based Athlete - Cap. Vitamina D",
    ordine: 10,
  },

  // === ALLENAMENTO RUNNING ===
  {
    categoria: "allenamento",
    domande: [
      "Come prepararsi per una maratona?",
      "How to train for a marathon?",
      "piano allenamento maratona",
      "preparazione 42 km",
      "training plan marathon",
    ],
    risposta:
      "Piano di 16-20 settimane. Base: 3-4 uscite/settimana. Lungo settimanale progressivo (fino a 32-35 km). 1 sessione di qualità (ripetute o tempo run). Scott Jurek enfatizza: il lungo lento è la base di tutto. Aumenta il volume max 10%/settimana. Le ultime 2-3 settimane: tapering (riduzione 40-60% del volume).",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 11,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come prepararsi per un ultra trail?",
      "How to prepare for an ultra trail?",
      "allenamento ultra maratona",
      "preparazione 100 km",
      "ultra trail training",
    ],
    risposta:
      "Oltre alla base aerobica: lunghi in montagna (back-to-back nei weekend), allenamento al dislivello, tempo sulle gambe più importante della velocità. Rich Roll: 'L'ultra non è una gara di velocità, è una gara di gestione'. Allena anche: nutrizione in movimento, corsa notturna, cambio equipaggiamento. Piano di 6-12 mesi.",
    fonte: "Finding Ultra - Rich Roll / Eat & Run - Scott Jurek",
    ordine: 12,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come evitare infortuni nella corsa?",
      "How to prevent running injuries?",
      "prevenzione infortuni runner",
      "dolore ginocchio corsa",
      "stretching per runner",
    ],
    risposta:
      "Regola d'oro: non aumentare volume o intensità più del 10%/settimana. Fondamentali: esercizi di forza per glutei e core (2x/settimana), stretching dinamico prima, statico dopo. Scott Jurek: mobilità delle anche e forza del piede sono la base. Ascolta il corpo: un dolore che peggiora correndo richiede riposo.",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 13,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come migliorare la resistenza?",
      "How to improve endurance?",
      "aumentare resistenza corsa",
      "correre più a lungo",
      "base aerobica",
    ],
    risposta:
      "L'80% degli allenamenti deve essere a bassa intensità (puoi parlare comodamente). Il lungo settimanale è il re: aumenta di 2-3 km/settimana. Rich Roll ha costruito la sua base aerobica con mesi di corsa lenta. Aggiungi gradualmente: collinare, fartlek, e tempo run per il 20% ad alta intensità.",
    fonte: "Finding Ultra - Rich Roll",
    ordine: 14,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come gestire il recupero?",
      "How to manage recovery?",
      "recupero dopo allenamento",
      "rest day importante",
      "overtraining sintomi",
    ],
    risposta:
      "Il recupero è dove avviene il miglioramento. Giorni di riposo: almeno 1-2/settimana. Sonno: 7-9 ore. Post-allenamento: proteine + carboidrati entro 30 min. Rich Roll: 'Ho imparato a rispettare il riposo quanto l'allenamento'. Segnali di sovrallenamento: stanchezza persistente, frequenza cardiaca a riposo elevata, irritabilità, insonnia.",
    fonte: "Finding Ultra - Rich Roll",
    ordine: 15,
  },

  // === TRAIL RUNNING SPECIFICO ===
  {
    categoria: "allenamento",
    domande: [
      "Come allenarsi per le salite?",
      "How to train for uphill running?",
      "allenamento dislivello",
      "corsa in salita",
      "trail running salite",
    ],
    risposta:
      "Allenamento specifico: ripetute in salita (30s-3min), lunghi collinari, escursionismo veloce (power hiking). Tecnica: passi corti, usa le braccia, cammina sulle pendenze >15-20%. Scott Jurek camminava anche in gara sulle salite ripide della Western States. Forza: step-up, squat, affondi in salita.",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 16,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come correre in discesa senza farsi male?",
      "How to run downhill safely?",
      "tecnica discesa trail",
      "dolore quadricipiti discesa",
      "downhill running technique",
    ],
    risposta:
      "Tecnica: passi brevi e frequenti, corpo leggermente inclinato in avanti (non indietro!), braccia larghe per equilibrio, sguardo avanti (non ai piedi). Allena i quadricipiti con eccentriche (squat lenti nella fase di discesa). I bastoncini aiutano sulle discese lunghe. Inizia con discese brevi e aumenta gradualmente.",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 17,
  },

  // === MINDSET E MOTIVAZIONE ===
  {
    categoria: "mindset",
    domande: [
      "Come gestire la fatica mentale in gara?",
      "How to handle mental fatigue during a race?",
      "motivazione durante la gara",
      "crisi in gara",
      "mental toughness running",
    ],
    risposta:
      "Scott Jurek: 'Corri il miglio che stai correndo'. Non pensare alla distanza totale, concentrati sul prossimo ristoro/km. Rich Roll: 'Il dolore è temporaneo, la rinuncia è permanente'. Tecniche: mantra personale, suddividi la gara in segmenti, celebra ogni traguardo intermedio. La crisi passa sempre: gestisci nutrizione e idratazione.",
    fonte: "Eat & Run / Finding Ultra",
    ordine: 18,
  },
  {
    categoria: "mindset",
    domande: [
      "Come iniziare a correre da zero?",
      "How to start running from scratch?",
      "principiante corsa",
      "couch to 5K",
      "iniziare a correre a 40 anni",
    ],
    risposta:
      "Rich Roll ha iniziato a 40 anni, sovrappeso, e in pochi anni è diventato uno degli ultraatleti più forti. Il suo consiglio: inizia camminando, poi alterna corsa/camminata (es. 1 min corsa + 2 min camminata). Aumenta gradualmente. Non importa la velocità, importa la costanza. 3 uscite/settimana sono sufficienti per costruire la base.",
    fonte: "Finding Ultra - Rich Roll",
    ordine: 19,
  },
  {
    categoria: "mindset",
    domande: [
      "La dieta vegana riduce le performance?",
      "Does a vegan diet reduce athletic performance?",
      "performance atleta vegano",
      "vegano e sport",
      "plant based penalizza",
    ],
    risposta:
      "No. Scott Jurek ha vinto 7 Western States consecutive da vegano. Rich Roll ha completato 5 Ironman in 5 giorni. Gli studi mostrano che una dieta plant-based ben pianificata può migliorare il recupero (meno infiammazione), la salute cardiovascolare e l'endurance. La chiave è 'ben pianificata': varietà, proteine adeguate e integrazione B12/D/Omega-3.",
    fonte: "The Plant-Based Athlete / Eat & Run / Finding Ultra",
    ordine: 20,
  },

  // === RICETTE E PASTI ===
  {
    categoria: "ricette",
    domande: [
      "Colazione ideale per un runner?",
      "Best breakfast for a runner?",
      "colazione pre allenamento",
      "cosa mangiare a colazione",
      "breakfast plant based runner",
    ],
    risposta:
      "Porridge di avena con banana, semi di chia, burro di mandorle e mirtilli. Alternativa: smoothie bowl con banana congelata, spinaci, proteine di pisello e granola. Scott Jurek: 'La colazione è il pasto più importante - carboidrati complessi per energia sostenuta'. 2-3 ore prima di correre per digestione completa.",
    fonte: "Eat & Run - Scott Jurek / The Plant-Based Athlete",
    ordine: 21,
  },
  {
    categoria: "ricette",
    domande: [
      "Smoothie di recupero post corsa?",
      "Recovery smoothie after running?",
      "frullato post allenamento",
      "protein shake vegano",
      "smoothie recupero",
    ],
    risposta:
      "Ricetta di Matt Frazier: 1 banana, 1 tazza di frutti di bosco, 1 cucchiaio di burro di mandorle, 1 scoop proteine di pisello, 1 tazza di latte di avena, 1 cucchiaio di semi di chia. Frulla tutto. Rapporto carbo:proteine 3:1 ideale per il recupero. Bevi entro 30 minuti dalla fine dell'allenamento.",
    fonte: "The Plant-Based Athlete - Ricette",
    ordine: 22,
  },
  {
    categoria: "ricette",
    domande: [
      "Snack energetici fatti in casa?",
      "Homemade energy snacks?",
      "barrette energetiche vegane",
      "snack per trail",
      "energy balls recipe",
    ],
    risposta:
      "Energy balls di Scott Jurek: datteri + avena + burro di arachidi + cacao + semi di chia. Frulla, forma palline, metti in frigo. Alternativa: barrette con riso soffiato + burro di mandorle + sciroppo d'acero + semi misti. Per il trail: datteri ripieni di burro di mandorle sono perfetti (carboidrati rapidi + grassi + potassio).",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 23,
  },
  {
    categoria: "ricette",
    domande: [
      "Pasto serale di recupero?",
      "Recovery dinner recipe?",
      "cena runner",
      "pasto recupero sera",
      "dinner plant based athlete",
    ],
    risposta:
      "Bowl di quinoa o riso integrale + legumi (lenticchie, ceci, fagioli neri) + verdure arrostite (patate dolci, broccoli, peperoni) + avocado + salsa tahini. Rich Roll: 'La semplicità è la chiave - cereali + legumi + verdure in infinite combinazioni'. Aggiungi curcuma e zenzero per proprietà anti-infiammatorie.",
    fonte: "Finding Ultra - Rich Roll / The Plant-Based Athlete",
    ordine: 24,
  },

  // === NUTRIZIONE SPECIFICA ===
  {
    categoria: "nutrizione",
    domande: [
      "Carboidrati per runner: quanti?",
      "How many carbs for runners?",
      "carboidrati maratona",
      "carb loading",
      "carboidrati allenamento",
    ],
    risposta:
      "Runner di endurance: 5-8 g/kg al giorno in allenamento normale, 8-12 g/kg nei 2-3 giorni pre-gara (carb loading). Fonti migliori: avena, riso integrale, quinoa, patate dolci, banane, legumi. I carboidrati sono il carburante primario per la corsa. Non temerli: Frazier e Cheeke li chiamano 'il fondamento della performance'.",
    fonte: "The Plant-Based Athlete - Cap. Carboidrati",
    ordine: 25,
  },
  {
    categoria: "nutrizione",
    domande: [
      "Grassi sani per l'endurance?",
      "Healthy fats for endurance?",
      "grassi buoni runner",
      "avocado noci semi",
      "fat adaptation running",
    ],
    risposta:
      "I grassi insaturi supportano il cuore e forniscono energia per sforzi prolungati (>2 ore). Fonti top: avocado, noci, semi di chia, semi di lino, olio EVO. Rich Roll attribuisce parte della sua trasformazione all'inclusione di grassi sani nella dieta. Non superare il 20-30% delle calorie totali. Evita grassi saturi e trans.",
    fonte: "Finding Ultra - Rich Roll / The Plant-Based Athlete",
    ordine: 26,
  },
  {
    categoria: "nutrizione",
    domande: [
      "Come ridurre l'infiammazione con il cibo?",
      "How to reduce inflammation with food?",
      "anti infiammatorio naturale",
      "recupero infiammazione",
      "alimenti antiossidanti runner",
    ],
    risposta:
      "Top anti-infiammatori: curcuma (con pepe nero per assorbimento), zenzero, frutti di bosco (mirtilli, lamponi), ciliegie acide, barbabietole, verdure a foglia verde scuro. Una dieta plant-based è naturalmente anti-infiammatoria perché elimina i cibi pro-infiammatori (carne rossa, latticini, zuccheri raffinati). Scott Jurek lo considera il vantaggio principale.",
    fonte: "Eat & Run - Scott Jurek / The Plant-Based Athlete",
    ordine: 27,
  },
  {
    categoria: "nutrizione",
    domande: [
      "Idratazione durante la corsa?",
      "Hydration while running?",
      "quanta acqua bere correndo",
      "elettroliti corsa",
      "disidratazione runner",
    ],
    risposta:
      "Regola base: 150-250 ml ogni 15-20 minuti. Per sforzi >1 ora: aggiungi elettroliti (sodio, potassio, magnesio). Fonti naturali: acqua di cocco, banane, datteri con un pizzico di sale. Non aspettare la sete. Peso pre/post corsa: ogni kg perso = 1.5 litri da reintegrare. In gara lunga: alterna acqua ed elettroliti ad ogni ristoro.",
    fonte: "The Plant-Based Athlete - Cap. Idratazione",
    ordine: 28,
  },

  // === CALCIO E OSSA ===
  {
    categoria: "integrazione",
    domande: [
      "Calcio senza latticini?",
      "Calcium without dairy?",
      "calcio vegano runner",
      "ossa forti vegano",
      "fonti calcio vegetale",
    ],
    risposta:
      "Fonti: cavolo riccio (150mg/tazza), broccoli, mandorle, tofu con solfato di calcio (350mg/porzione), fichi secchi, latte vegetale fortificato. Il calcio vegetale ha spesso un tasso di assorbimento superiore al latte vaccino. L'esercizio con impatto (corsa) rafforza le ossa. Abbina vitamina D per l'assorbimento.",
    fonte: "The Plant-Based Athlete - Cap. Calcio",
    ordine: 29,
  },

  // === EQUIPAGGIAMENTO ===
  {
    categoria: "equipaggiamento",
    domande: [
      "Cosa portare in un ultra trail?",
      "What to bring to an ultra trail?",
      "zaino ultra trail",
      "equipaggiamento obbligatorio",
      "materiale gara trail",
    ],
    risposta:
      "Essenziali: zaino da trail (5-12L), flask o soft flask (min 1L), giacca impermeabile, lampada frontale + batterie, coperta di emergenza, fischietto, telefono carico, kit primo soccorso minimo. Nutrizione: calcola 200-300 cal/ora. Rich Roll: 'Prova tutto in allenamento, mai nulla di nuovo in gara'. Scarpe: testate su distanza simile.",
    fonte: "Finding Ultra - Rich Roll",
    ordine: 30,
  },
  {
    categoria: "equipaggiamento",
    domande: [
      "Scarpe da trail running?",
      "Trail running shoes?",
      "come scegliere scarpe trail",
      "scarpe ultra trail",
      "drop scarpe corsa",
    ],
    risposta:
      "Per il trail: suola con buon grip (Vibram/Contagrip), protezione rocce, drop 4-8mm. Per ultra: comfort > leggerezza, mezza taglia in più (i piedi si gonfiano). Scott Jurek correva con scarpe minimaliste, ma per la maggior parte dei runner è meglio una via di mezzo. Prova le scarpe su terreno simile alla gara. Alterna 2-3 paia in allenamento.",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 31,
  },

  // === TRANSIZIONE PLANT-BASED ===
  {
    categoria: "nutrizione",
    domande: [
      "Come passare a una dieta plant-based?",
      "How to transition to a plant-based diet?",
      "diventare vegano runner",
      "transizione vegana",
      "iniziare plant based",
    ],
    risposta:
      "Rich Roll consiglia una transizione graduale: inizia eliminando carne rossa, poi pollo, poi pesce, poi latticini. In 4-6 settimane. Aggiungi prima di togliere: sperimenta nuovi legumi, cereali, verdure. Non cercare la perfezione al 100% dal giorno 1. Matt Frazier: 'Il 90% plant-based è meglio del 0%'. Impara 5-10 ricette base e ruota.",
    fonte: "Finding Ultra - Rich Roll / The Plant-Based Athlete",
    ordine: 32,
  },
  {
    categoria: "nutrizione",
    domande: [
      "La dieta vegana è adatta ai bambini sportivi?",
      "Is a vegan diet suitable for young athletes?",
      "bambini vegani sport",
      "adolescenti plant based",
    ],
    risposta:
      "Con pianificazione adeguata, sì. L'American Dietetic Association conferma che le diete vegetariane/vegane ben pianificate sono appropriate per tutte le fasi della vita. Punti chiave per giovani atleti: calorie sufficienti, varietà di proteine, integrazione B12 e D, monitoraggio ferro. Consultare un nutrizionista sportivo per piani personalizzati.",
    fonte: "The Plant-Based Athlete - Cap. Nutrizione per Tutte le Età",
    ordine: 33,
  },

  // === GESTIONE PESO ===
  {
    categoria: "nutrizione",
    domande: [
      "Come gestire il peso per la corsa?",
      "How to manage weight for running?",
      "peso ideale runner",
      "dimagrire correndo",
      "composizione corporea runner",
    ],
    risposta:
      "Una dieta plant-based naturalmente densa di nutrienti e meno calorica aiuta a raggiungere il peso forma. Rich Roll ha perso 20+ kg passando al plant-based. Non contare calorie ossessivamente: mangia abbondante verdura, cereali integrali e legumi. Il peso si stabilizza naturalmente. Per la performance: concentrati sulla qualità del cibo, non sulla restrizione.",
    fonte: "Finding Ultra - Rich Roll",
    ordine: 34,
  },

  // === SONNO E RECUPERO ===
  {
    categoria: "recupero",
    domande: [
      "Come migliorare il sonno per il recupero?",
      "How to improve sleep for recovery?",
      "sonno runner",
      "dormire bene allenamento",
      "sleep quality athlete",
    ],
    risposta:
      "7-9 ore per atleti di endurance. Routine: cena leggera 2-3h prima, niente schermi 1h prima, camera fresca e buia. Cibi che aiutano: ciliegie acide (melatonina naturale), banane (triptofano), camomilla. Rich Roll: 'Il sonno è il mio integratore più potente'. Il magnesio la sera può aiutare il rilassamento muscolare.",
    fonte: "Finding Ultra - Rich Roll",
    ordine: 35,
  },

  // === BARBABIETOLE E PERFORMANCE ===
  {
    categoria: "nutrizione",
    domande: [
      "Succo di barbabietola e performance?",
      "Beetroot juice and performance?",
      "barbabietola pre gara",
      "nitrati corsa",
      "beetroot runner",
    ],
    risposta:
      "I nitrati delle barbabietole migliorano l'efficienza dell'ossigeno del 3-5%. Protocollo: 500ml di succo di barbabietola (o 70ml di shot concentrato) 2-3 ore prima della gara, per 3-6 giorni consecutivi pre-gara per effetto massimo. Anche spinaci e rucola sono ricchi di nitrati. Frazier lo cita come uno dei 'supercibi' per runner.",
    fonte: "The Plant-Based Athlete - Cap. Superfoods",
    ordine: 36,
  },

  // === CAFFEINA ===
  {
    categoria: "nutrizione",
    domande: [
      "Caffeina e corsa?",
      "Caffeine and running?",
      "caffè prima di correre",
      "caffeina pre gara",
      "coffee performance",
    ],
    risposta:
      "La caffeina migliora la performance del 2-4%. Dosaggio ottimale: 3-6 mg/kg, 30-60 minuti prima. Per una persona di 70 kg: 200-400 mg (2-3 caffè). In ultra: caffeina strategica nelle fasi finali o notturne. Non abusarne in allenamento per mantenere la sensibilità. Scott Jurek usava gel con caffeina nelle fasi cruciali delle gare.",
    fonte: "Eat & Run - Scott Jurek / The Plant-Based Athlete",
    ordine: 37,
  },

  // === DOMANDE GENERALI ===
  {
    categoria: "mindset",
    domande: [
      "Chi è Scott Jurek?",
      "Who is Scott Jurek?",
      "scott jurek biografia",
      "western states jurek",
    ],
    risposta:
      "Scott Jurek è uno dei più grandi ultramaratoneti della storia. 7 vittorie consecutive alla Western States 100, record dell'Appalachian Trail (2015). Vegano dal 1999. Il suo libro 'Eat & Run' racconta come la dieta plant-based ha alimentato le sue imprese. Famoso per correre con sandali e per la sua filosofia 'sometimes you just do things'.",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 38,
  },
  {
    categoria: "mindset",
    domande: [
      "Chi è Rich Roll?",
      "Who is Rich Roll?",
      "rich roll biografia",
      "finding ultra storia",
    ],
    risposta:
      "Rich Roll è un ultra-atleta americano che a 40 anni ha trasformato la sua vita. Ex avvocato, alcolista in recupero, sovrappeso. Ha adottato la dieta Plantpower e in 2 anni ha completato 5 Ironman in 5 giorni consecutivi (EPIC5). Il suo podcast 'The Rich Roll Podcast' è uno dei più popolari al mondo su salute e performance.",
    fonte: "Finding Ultra - Rich Roll",
    ordine: 39,
  },
  {
    categoria: "mindset",
    domande: [
      "Chi sono Matt Frazier e Robert Cheeke?",
      "Who are Matt Frazier and Robert Cheeke?",
      "no meat athlete",
      "plant based athlete autori",
    ],
    risposta:
      "Matt Frazier è il fondatore di No Meat Athlete, community online per atleti plant-based. Maratoneta e ultrarunner. Robert Cheeke è un bodybuilder vegano pioniere, autore di diversi libri sul fitness plant-based. Insieme hanno scritto 'The Plant-Based Athlete', diventato un NYT Bestseller, con la scienza e le ricette per atleti vegetali.",
    fonte: "The Plant-Based Athlete",
    ordine: 40,
  },

  // === ALLENAMENTO AVANZATO ===
  {
    categoria: "allenamento",
    domande: [
      "Cos'è il fartlek?",
      "What is fartlek training?",
      "fartlek running",
      "allenamento fartlek",
      "variazioni di ritmo",
    ],
    risposta:
      "Il fartlek ('gioco di velocità' in svedese) alterna ritmi veloci e lenti in modo non strutturato. Esempio: corsa facile 5 min, poi sprint al lampione, poi recupero al prossimo incrocio, poi ritmo gara per 3 min. Perfetto per trail dove il terreno varia naturalmente. Migliora velocità e resistenza senza la rigidità delle ripetute in pista.",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 41,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come allenare la forza per il running?",
      "Strength training for runners?",
      "esercizi forza runner",
      "palestra e corsa",
      "core training running",
    ],
    risposta:
      "2 sessioni/settimana di 20-30 minuti. Esercizi chiave: squat, affondi, step-up, ponte glutei, plank, dead bug. Focus su glutei (stabilizzano le anche), core (trasferimento di forza) e polpacci. Scott Jurek: 'La forza previene gli infortuni più di qualsiasi stretching'. Usa il peso corporeo o carichi leggeri. Mai il giorno prima del lungo.",
    fonte: "Eat & Run - Scott Jurek",
    ordine: 42,
  },

  // === ZINCO E IODIO ===
  {
    categoria: "integrazione",
    domande: [
      "Zinco per atleti vegani?",
      "Zinc for vegan athletes?",
      "zinco fonti vegetali",
      "zinco e recupero",
    ],
    risposta:
      "Lo zinco supporta sistema immunitario e recupero. Fonti: semi di zucca (7mg/30g), ceci, lenticchie, anacardi, avena. L'ammollo dei legumi e la germinazione aumentano la biodisponibilità. Runner: fabbisogno leggermente superiore per le perdite con il sudore. Considera 15-25 mg/giorno da cibo + eventuale integratore se i livelli sono bassi.",
    fonte: "The Plant-Based Athlete - Cap. Minerali",
    ordine: 43,
  },
  {
    categoria: "integrazione",
    domande: [
      "Iodio da fonti vegetali?",
      "Iodine from plant sources?",
      "iodio vegano",
      "alghe iodio",
      "sale iodato",
    ],
    risposta:
      "Fonti: alghe (nori, wakame), sale iodato, patate. 2 fogli di alga nori a settimana sono sufficienti. Attenzione alla kelp: il contenuto di iodio è molto variabile e dosi eccessive possono essere dannose per la tiroide. Il sale iodato è la fonte più semplice e controllata. Non eccedere: 150 mcg/giorno è il fabbisogno adulto.",
    fonte: "The Plant-Based Athlete - Cap. Minerali",
    ordine: 44,
  },

  // === MOTIVAZIONE SPECIFICA ===
  {
    categoria: "mindset",
    domande: [
      "Citazioni motivazionali per runner?",
      "Motivational quotes for runners?",
      "frasi motivazionali corsa",
      "ispirazione running",
    ],
    risposta:
      "'Sometimes you just do things.' — Scott Jurek. 'The pain is temporary, quitting is permanent.' — Rich Roll. 'Eat clean, train dirty, and run free.' — Scott Jurek. 'I wasn't born to do this. I just decided to.' — Rich Roll. 'The body achieves what the mind believes.' — concetto ricorrente in tutti e 3 i libri.",
    fonte: "Eat & Run / Finding Ultra / The Plant-Based Athlete",
    ordine: 45,
  },
  {
    categoria: "mindset",
    domande: [
      "Come rimanere motivati ad allenarsi?",
      "How to stay motivated to train?",
      "motivazione allenamento",
      "costanza nella corsa",
      "non ho voglia di correre",
    ],
    risposta:
      "Rich Roll: 'Non aspettare la motivazione, crea l'abitudine'. Consigli pratici: corri alla stessa ora ogni giorno, prepara i vestiti la sera prima, trova un compagno di allenamento, iscriviti a una gara come obiettivo. Scott Jurek: metti le scarpe e esci — i primi 10 minuti sono i più difficili, poi il corpo prende il sopravvento.",
    fonte: "Finding Ultra - Rich Roll / Eat & Run - Scott Jurek",
    ordine: 46,
  },

  // === FULVIO MASSINI - ANDIAMO A CORRERE ===
  {
    categoria: "allenamento",
    domande: [
      "Chi è Fulvio Massini?",
      "Who is Fulvio Massini?",
      "fulvio massini allenatore",
      "andiamo a correre libro",
    ],
    risposta:
      "Fulvio Massini è il più famoso preparatore atletico di maratoneti in Italia, con oltre 30 anni di esperienza. Il suo libro 'Andiamo a correre' (2016, Rizzoli, prefazione di Linus) è considerato la 'bibbia della corsa' italiana: 336 pagine su tecnica, allenamento personalizzato, alimentazione, integratori, prevenzione infortuni, mental training, con capitoli dedicati a donne, giovani e runner over 50.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 47,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come preparare una maratona secondo Massini?",
      "Massini marathon training plan?",
      "piano maratona Massini",
      "preparazione maratona 12 settimane",
      "metodo Massini maratona",
    ],
    risposta:
      "Massini consiglia 12-16 settimane di preparazione. Schema: 3 settimane dure + 1 di scarico (o 2+1). Lungo massimo: 36 km (anche 32 km dà ottimi risultati), da fare 3 settimane prima della gara. Aumentare di 2-4 km ogni 2 settimane. Primo weekend: test Conconi o test 10 km per trovare la Velocità di Riferimento (VR), dato fondamentale per impostare tutti i ritmi.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 48,
  },
  {
    categoria: "allenamento",
    domande: [
      "Cosa sono le ripetute secondo Massini?",
      "Massini interval training?",
      "ripetute maratona",
      "ripetute 1000 metri",
      "ripetute Massini distanze",
    ],
    risposta:
      "Massini distingue le ripetute per distanza: 1000 m (5-6 sec più veloci della VR), 2000 m (3-4 sec più veloci), 3000 m (tra VR e 2 sec più veloci). Volumi: principianti 1-2-3 km, avanzati 8-10x1km, 4-5x2km, o 3-4x3km. Recupero: 1'-1'30\" per atleti forti, 2'-3' per meno esperti. Sempre jogging lento nel recupero, mai fermi.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 49,
  },
  {
    categoria: "allenamento",
    domande: [
      "Cos'è la velocità di riferimento VR?",
      "What is reference velocity in running?",
      "velocità riferimento Massini",
      "VR corsa",
      "test Conconi corsa",
    ],
    risposta:
      "La Velocità di Riferimento (VR) è il parametro chiave del metodo Massini. Si determina con: test Conconi (frequenza cardiaca vs velocità), test del lattato, test sui 3 km, o gara recente sui 10-12 km. La VR corrisponde circa alla soglia anaerobica. Tutti i ritmi di allenamento (lungo, medio, ripetute, fartlek) si calcolano come scostamento dalla VR.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 50,
  },
  {
    categoria: "allenamento",
    domande: [
      "Cos'è il medio variato?",
      "What is varied tempo run?",
      "medio variato Massini",
      "allenamento potenza lipidica",
      "alternare ritmi maratona",
    ],
    risposta:
      "Il medio variato è un allenamento chiave di Massini per sviluppare la potenza lipidica (capacità di correre forte usando i grassi). Si alternano 1 km a ritmo veloce (passo mezza maratona, 5-10 sec/km più lento della VR) con 1 km di recupero (40-50 sec/km più lento della VR). Si parte da 8 km totali e si arriva a 14-16 km. L'ultimo km sempre a passo mezza maratona.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 51,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come fare il tapering prima di una gara?",
      "How to taper before a race?",
      "scarico pre gara",
      "ridurre allenamento prima maratona",
      "tapering maratona",
    ],
    risposta:
      "Massini: nelle ultime 3 settimane prima della maratona ridurre il volume del 30-50%. L'ultimo lungo (max 36 km) va fatto 3 settimane prima. Nelle settimane di scarico: mantenere qualche stimolo di qualità (brevi ripetute, allunghi) ma ridurre drasticamente il volume. Il giorno dopo il lungo: 4-6x100-200 m ad andatura VR, oppure bici 20-40 km o nuoto 500-1000 m.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 52,
  },
  {
    categoria: "allenamento",
    domande: [
      "Ripetute in salita per la corsa?",
      "Hill repeats for running?",
      "ripetute salita Massini",
      "allenamento colline",
      "salite 1 km corsa",
    ],
    risposta:
      "Massini consiglia 4x1 km in salita su pendenze del 3-4%, a intensità sostenuta (respirazione impegnata). Recupero: discesa a passo lento. I runner avanzati possono arrivare a 8x1 km. Le salite sviluppano forza specifica, potenza aerobica e resistenza mentale. Vanno inserite 1 volta ogni 2 settimane nel periodo di costruzione.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 53,
  },
  {
    categoria: "allenamento",
    domande: [
      "Come iniziare a correre secondo Massini?",
      "Massini beginner running plan?",
      "principiante corsa Massini",
      "primo allenamento corsa",
      "programma iniziare a correre",
    ],
    risposta:
      "Massini: tutti possono correre, non solo gli agonisti. Per i principianti: iniziare alternando corsa e camminata (es. 2' corsa + 3' camminata, ripetere 6-8 volte). Aumentare gradualmente la parte di corsa. 3 uscite/settimana sono sufficienti. Non guardare il ritmo, ma le sensazioni. Il libro dedica capitoli specifici a donne, giovani e over 50 con programmi adattati.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 54,
  },
  {
    categoria: "allenamento",
    domande: [
      "Tecnica di corsa corretta?",
      "Proper running form?",
      "postura corsa",
      "appoggio piede corsa",
      "come correre bene",
    ],
    risposta:
      "Massini sui fondamentali della tecnica: busto leggermente inclinato in avanti, sguardo all'orizzonte (non ai piedi), braccia piegate a 90° con oscillazione naturale, appoggio del piede sotto il baricentro (non in avanti). Frequenza di passo: 170-180 passi/minuto è l'ideale. Evitare di 'saltare': la corsa efficiente è orizzontale, non verticale. Esercizi di tecnica (skip, calciata, allunghi) prima della seduta principale.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 55,
  },
  {
    categoria: "allenamento",
    domande: [
      "Respirazione durante la corsa?",
      "How to breathe while running?",
      "respirazione corsa",
      "fiato corto correndo",
      "come respirare correndo",
    ],
    risposta:
      "Massini: respira sia con il naso che con la bocca, senza forzare. Il ritmo respiratorio si adatta naturalmente all'intensità. A ritmo lento: inspira 3-4 passi, espira 3-4 passi. A ritmo sostenuto: 2 passi inspira, 2 passi espira. Se non riesci a parlare, stai andando troppo forte. La respirazione diaframmatica (pancia, non petto) è più efficiente.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 56,
  },
  {
    categoria: "allenamento",
    domande: [
      "Prevenzione infortuni nella corsa Massini?",
      "Massini injury prevention?",
      "infortuni runner Massini",
      "stretching prima di correre",
      "riscaldamento corsa",
    ],
    risposta:
      "Massini dedica un intero capitolo alla prevenzione: riscaldamento con 10-15' di corsa lenta + esercizi di mobilità articolare prima della seduta. Stretching statico SOLO dopo la corsa, mai a freddo. Regola del 10%: non aumentare il carico settimanale di più del 10%. Scarpe: cambiarle ogni 800-1000 km. Ascoltare i segnali del corpo: un dolore che persiste oltre 3 giorni richiede riposo o visita medica.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 57,
  },
  {
    categoria: "allenamento",
    domande: [
      "Corsa per donne: consigli?",
      "Running tips for women?",
      "donna runner consigli",
      "corsa e ciclo mestruale",
      "donne e maratona",
    ],
    risposta:
      "Massini dedica un capitolo alle runner donne. Punti chiave: adattare l'allenamento al ciclo mestruale (fase follicolare: più energia per lavori intensi; fase lutea: privilegiare il fondo lento). Attenzione a ferro e calcio (integrazione se necessario). Reggiseno sportivo adeguato è fondamentale. Le donne hanno naturalmente una buona resistenza aerobica e spesso eccellono nelle ultra-distanze.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 58,
  },
  {
    categoria: "allenamento",
    domande: [
      "Correre dopo i 50 anni?",
      "Running after 50?",
      "runner over 50",
      "corsa terza età",
      "anziani e corsa",
    ],
    risposta:
      "Massini: capitolo dedicato ai runner 'master'. Dopo i 50: recupero più lungo (almeno 48h tra sedute intense), riscaldamento più accurato (15-20'), privilegiare il fondo lento e il medio rispetto alle ripetute veloci. Forza: 2 sessioni/settimana sono ancora più importanti per prevenire sarcopenia. La corsa mantiene cuore, ossa e mente in salute. Non è mai troppo tardi per iniziare.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 59,
  },
  {
    categoria: "allenamento",
    domande: [
      "Preparare una mezza maratona?",
      "How to train for a half marathon?",
      "piano mezza maratona",
      "preparazione 21 km",
      "half marathon training",
    ],
    risposta:
      "Massini per la mezza maratona: 10-12 settimane di preparazione. Lungo massimo: 18-20 km. 1 seduta di qualità/settimana (ripetute o medio variato). Ritmo gara mezza: circa 10-15 sec/km più veloce del ritmo maratona. Settimana tipo: 1 lungo, 1 qualità, 1-2 fondi lenti. Ultimo lungo 2 settimane prima. Tapering: riduzione 30% l'ultima settimana.",
    fonte: "Andiamo a correre - Fulvio Massini",
    ordine: 60,
  },
];

async function main() {
  console.log("=== Seed AI Knowledge Base ===\n");

  const { error: delError } = await supabase
    .from("ai_knowledge_base")
    .delete()
    .gte("id", 0);
  if (delError) {
    console.error("Errore pulizia:", delError.message);
    process.exit(1);
  }

  const { error: insError } = await supabase
    .from("ai_knowledge_base")
    .insert(knowledgeBase);
  if (insError) {
    console.error("Errore inserimento:", insError.message);
    process.exit(1);
  }

  console.log(`Inserite ${knowledgeBase.length} voci nella knowledge base`);
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
