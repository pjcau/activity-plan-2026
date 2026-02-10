const libri = [
  {
    titolo: "The Plant-Based Athlete",
    sottotitolo: "A Game-Changing Approach to Peak Performance",
    autori: "Matt Frazier & Robert Cheeke",
    anno: 2021,
    descrizione:
      "La guida definitiva per collegare alimentazione plant-based e performance atletica di alto livello. Contiene oltre 60 ricette, interviste con più di 50 atleti professionisti e la scienza dietro i benefici di un'alimentazione 100% vegetale per sport e recupero. New York Times Bestseller.",
    perche:
      "Base per tutte le 60 ricette nella sezione Ricette del sito.",
    linkAmazon: "https://www.amazon.it/Plant-based-Athlete-Game-changing-Approach-Performance/dp/0063042010",
    lingua: "Inglese",
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
    linkAmazon: "https://www.amazon.it/straordinaria-grandi-ultramaratoneti-tutti-tempi/dp/8893710358",
    lingua: "Italiano",
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
    linkAmazon: "https://www.amazon.it/Finding-ultra-Rich-Roll/dp/8893710927",
    lingua: "Italiano",
  },
];

export default function Libri() {
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
          {libri.map((libro, i) => (
            <div
              key={i}
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
                  href={libro.linkAmazon}
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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Food Power Tips
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Consigli dal libro <span className="italic">The Plant-Based Athlete</span> per
            assumere tutti i nutrienti essenziali da fonti vegetali.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                nutriente: "Omega-3 (ALA/DHA)",
                fonti: "Semi di chia, semi di lino macinati, noci, alga spirulina",
                tip: "2 cucchiai di semi di chia al giorno coprono il fabbisogno di ALA. Per il DHA, considera un integratore da alghe.",
                colore: "bg-blue-50 text-blue-800 border-blue-200",
                badge: "bg-blue-100 text-blue-700",
              },
              {
                nutriente: "Vitamina B12",
                fonti: "Integratore o alimenti fortificati (latte vegetale, lievito alimentare)",
                tip: "L'unico nutriente che richiede sempre un integratore in una dieta 100% vegetale. 250 mcg/giorno.",
                colore: "bg-red-50 text-red-800 border-red-200",
                badge: "bg-red-100 text-red-700",
              },
              {
                nutriente: "Ferro",
                fonti: "Lenticchie, spinaci, semi di zucca, quinoa, cacao amaro",
                tip: "Abbina sempre con vitamina C (limone, peperoni) per aumentare l'assorbimento fino a 6 volte.",
                colore: "bg-orange-50 text-orange-800 border-orange-200",
                badge: "bg-orange-100 text-orange-700",
              },
              {
                nutriente: "Calcio",
                fonti: "Cavolo riccio, broccoli, mandorle, tofu (con solfato di calcio), fichi secchi",
                tip: "Il calcio vegetale ha un tasso di assorbimento spesso superiore a quello del latte vaccino.",
                colore: "bg-gray-50 text-gray-800 border-gray-200",
                badge: "bg-gray-200 text-gray-700",
              },
              {
                nutriente: "Proteine complete",
                fonti: "Tofu, tempeh, edamame, quinoa, grano saraceno, mix legumi + cereali",
                tip: "Non serve combinarli nello stesso pasto: basta variare nell'arco della giornata.",
                colore: "bg-emerald-50 text-emerald-800 border-emerald-200",
                badge: "bg-emerald-100 text-emerald-700",
              },
              {
                nutriente: "Vitamina D",
                fonti: "Esposizione solare (15-20 min/giorno), funghi esposti al sole, integratore D3 vegana",
                tip: "In inverno un integratore di 1000-2000 UI/giorno è raccomandato per chi vive sopra il 40° parallelo.",
                colore: "bg-yellow-50 text-yellow-800 border-yellow-200",
                badge: "bg-yellow-100 text-yellow-700",
              },
              {
                nutriente: "Zinco",
                fonti: "Semi di zucca, ceci, lenticchie, anacardi, avena",
                tip: "L'ammollo dei legumi e la germinazione aumentano la biodisponibilità dello zinco.",
                colore: "bg-purple-50 text-purple-800 border-purple-200",
                badge: "bg-purple-100 text-purple-700",
              },
              {
                nutriente: "Iodio",
                fonti: "Alghe (nori, kelp), sale iodato, patate",
                tip: "Bastano 2 fogli di alga nori alla settimana. Attenzione alla kelp: dosi eccessive possono essere controproducenti.",
                colore: "bg-teal-50 text-teal-800 border-teal-200",
                badge: "bg-teal-100 text-teal-700",
              },
            ].map((item) => (
              <div
                key={item.nutriente}
                className={`rounded-lg border p-4 ${item.colore}`}
              >
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${item.badge}`}
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
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-emerald-700 dark:bg-gray-800 text-white rounded-lg shadow-lg p-6 text-center transition-colors">
          <blockquote className="text-xl italic mb-4">
            &quot;The food you eat can be either the safest and most powerful
            form of medicine or the slowest form of poison.&quot;
          </blockquote>
          <cite className="text-emerald-200 dark:text-gray-400">— Ann Wigmore</cite>
        </div>
      </main>
    </div>
  );
}
