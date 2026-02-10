export default function Alimentazione() {
  const capisaldi = [
    {
      titolo: "Carboidrati complessi come base",
      descrizione: "Cereali integrali, legumi, patate e frutta forniscono energia sostenuta per gli allenamenti lunghi. I carboidrati sono il carburante primario per la corsa.",
      esempi: ["Avena", "Riso integrale", "Quinoa", "Patate dolci", "Legumi"],
    },
    {
      titolo: "Proteine vegetali complete",
      descrizione: "Combinando diverse fonti proteiche vegetali si ottengono tutti gli aminoacidi essenziali necessari per il recupero muscolare.",
      esempi: ["Legumi + cereali", "Tofu", "Tempeh", "Seitan", "Edamame"],
    },
    {
      titolo: "Grassi sani per l'endurance",
      descrizione: "I grassi insaturi supportano la salute cardiovascolare e forniscono energia per gli sforzi prolungati.",
      esempi: ["Avocado", "Noci", "Semi di chia", "Semi di lino", "Olio EVO"],
    },
    {
      titolo: "Antiossidanti e recupero",
      descrizione: "Frutta e verdura colorate riducono l'infiammazione e accelerano il recupero post-allenamento.",
      esempi: ["Frutti di bosco", "Verdure a foglia verde", "Barbabietole", "Ciliegie", "Curcuma"],
    },
    {
      titolo: "Idratazione e elettroliti",
      descrizione: "Acqua, frutta e verdura ad alto contenuto idrico mantengono l'equilibrio elettrolitico durante gli sforzi.",
      esempi: ["Acqua di cocco", "Anguria", "Cetrioli", "Sedano", "Banane"],
    },
    {
      titolo: "Timing nutrizionale",
      descrizione: "Pianificare i pasti in base agli allenamenti: carboidrati prima, proteine dopo, pasti leggeri pre-gara.",
      esempi: ["3h prima: pasto completo", "1h prima: snack leggero", "Post: proteine + carbo", "Sera: recupero"],
    },
  ];

  const integrazione = [
    { nome: "Vitamina B12", note: "Essenziale, non prodotta da fonti vegetali" },
    { nome: "Vitamina D", note: "Soprattutto in inverno, supporta ossa e immunità" },
    { nome: "Omega-3 (EPA/DHA)", note: "Da alghe, per infiammazione e recupero" },
    { nome: "Ferro", note: "Monitorare i livelli, abbinare a vitamina C" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Alimentazione Plant-Based per Runner</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Basato sui principi di <span className="font-semibold">&quot;Eat and Run&quot;</span> di Scott Jurek
            e <span className="font-semibold">&quot;Finding Ultra&quot;</span> di Rich Roll - ultramaratoneti
            che hanno dimostrato come un&apos;alimentazione 100% vegetale possa supportare prestazioni di endurance ai massimi livelli.
          </p>
        </div>

        {/* Capisaldi */}
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">I 6 Capisaldi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {capisaldi.map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 transition-colors">
              <div className="flex items-center mb-3">
                <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.titolo}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{item.descrizione}</p>
              <div className="flex flex-wrap gap-2">
                {item.esempi.map((esempio, j) => (
                  <span key={j} className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm">
                    {esempio}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Integrazione */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">Integrazione Consigliata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrazione.map((item, i) => (
              <div key={i} className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-emerald-600 mr-3">💊</span>
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{item.nome}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Food Power Tips */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Food Power Tips
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Consigli dal libro <span className="italic">The Plant-Based Athlete</span> per
            assumere tutti i nutrienti essenziali da fonti vegetali.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                nutriente: "Omega-3 (ALA/DHA)",
                fonti: "Semi di chia, semi di lino macinati, noci, alga spirulina",
                tip: "2 cucchiai di semi di chia al giorno coprono il fabbisogno di ALA. Per il DHA, considera un integratore da alghe.",
                colore: "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
                badge: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
              },
              {
                nutriente: "Vitamina B12",
                fonti: "Integratore o alimenti fortificati (latte vegetale, lievito alimentare)",
                tip: "L'unico nutriente che richiede sempre un integratore in una dieta 100% vegetale. 250 mcg/giorno.",
                colore: "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800",
                badge: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
              },
              {
                nutriente: "Ferro",
                fonti: "Lenticchie, spinaci, semi di zucca, quinoa, cacao amaro",
                tip: "Abbina sempre con vitamina C (limone, peperoni) per aumentare l'assorbimento fino a 6 volte.",
                colore: "bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800",
                badge: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
              },
              {
                nutriente: "Calcio",
                fonti: "Cavolo riccio, broccoli, mandorle, tofu (con solfato di calcio), fichi secchi",
                tip: "Il calcio vegetale ha un tasso di assorbimento spesso superiore a quello del latte vaccino.",
                colore: "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700",
                badge: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
              },
              {
                nutriente: "Proteine complete",
                fonti: "Tofu, tempeh, edamame, quinoa, grano saraceno, mix legumi + cereali",
                tip: "Non serve combinarli nello stesso pasto: basta variare nell'arco della giornata.",
                colore: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
                badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
              },
              {
                nutriente: "Vitamina D",
                fonti: "Esposizione solare (15-20 min/giorno), funghi esposti al sole, integratore D3 vegana",
                tip: "In inverno un integratore di 1000-2000 UI/giorno è raccomandato per chi vive sopra il 40° parallelo.",
                colore: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
                badge: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
              },
              {
                nutriente: "Zinco",
                fonti: "Semi di zucca, ceci, lenticchie, anacardi, avena",
                tip: "L'ammollo dei legumi e la germinazione aumentano la biodisponibilità dello zinco.",
                colore: "bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800",
                badge: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
              },
              {
                nutriente: "Iodio",
                fonti: "Alghe (nori, kelp), sale iodato, patate",
                tip: "Bastano 2 fogli di alga nori alla settimana. Attenzione alla kelp: dosi eccessive possono essere controproducenti.",
                colore: "bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800",
                badge: "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300",
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

        {/* Citazione */}
        <div className="bg-emerald-700 dark:bg-gray-800 text-white rounded-lg shadow-lg p-6 text-center transition-colors">
          <blockquote className="text-xl italic mb-4">
            &quot;Eat clean, train dirty, and run free.&quot;
          </blockquote>
          <cite className="text-emerald-200 dark:text-gray-400">— Scott Jurek, Eat and Run</cite>
        </div>
      </main>
    </div>
  );
}
