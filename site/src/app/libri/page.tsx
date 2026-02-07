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
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Libri Consigliati
          </h1>
          <p className="text-gray-600">
            I 3 libri che hanno ispirato questo progetto e la filosofia
            alimentare plant-based per runner e atleti di endurance.
          </p>
        </div>

        {/* Lista libri */}
        <div className="space-y-6 mb-8">
          {libri.map((libro, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                {/* Titolo e badge lingua */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {libro.titolo}
                    </h2>
                    <p className="text-gray-500 italic">{libro.sottotitolo}</p>
                  </div>
                  <span className="ml-3 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 whitespace-nowrap">
                    {libro.lingua}
                  </span>
                </div>

                {/* Autori e anno */}
                <p className="text-emerald-700 font-medium mb-4">
                  {libro.autori}{" "}
                  <span className="text-gray-400 font-normal">
                    ({libro.anno})
                  </span>
                </p>

                {/* Descrizione */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {libro.descrizione}
                </p>

                {/* Perché lo usiamo */}
                <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-emerald-800">
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

        {/* Footer */}
        <div className="bg-emerald-700 text-white rounded-lg shadow-lg p-6 text-center">
          <blockquote className="text-xl italic mb-4">
            &quot;The food you eat can be either the safest and most powerful
            form of medicine or the slowest form of poison.&quot;
          </blockquote>
          <cite className="text-emerald-200">— Ann Wigmore</cite>
        </div>
      </main>
    </div>
  );
}
