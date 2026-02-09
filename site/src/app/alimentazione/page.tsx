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
