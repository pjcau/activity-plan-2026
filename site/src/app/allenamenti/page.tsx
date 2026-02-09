export default function Allenamenti() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center transition-colors">
          <div className="text-6xl mb-6">🏃‍♂️</div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Allenamenti</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Sezione in costruzione
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-amber-800 dark:text-amber-200">
              Stiamo lavorando al piano di allenamento personalizzato per le gare selezionate.
            </p>
            <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
              Prossimamente: schede settimanali, progressioni, recupero attivo
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
