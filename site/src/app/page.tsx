type Gara = {
  data: string;
  nome: string;
  distanza: string;
  tipo: "Trail" | "Strada";
  localita: string;
};

const gare: { febbraio: Gara[]; marzo: Gara[] } = {
  febbraio: [
    { data: "8 feb", nome: "Brunello Crossing", distanza: "45 km", tipo: "Trail", localita: "Montalcino" },
    { data: "8 feb", nome: "Maratonina de' 6 Ponti", distanza: "21 km", tipo: "Strada", localita: "Agliana" },
    { data: "8 feb", nome: "Lido Run", distanza: "10 km", tipo: "Strada", localita: "Lido di Camaiore" },
    { data: "15 feb", nome: "Trail del Poggiolo", distanza: "20 km", tipo: "Trail", localita: "Palazzuolo sul Senio" },
    { data: "15 feb", nome: "Trail Monte Spinosa", distanza: "20 km", tipo: "Trail", localita: "Venturina Terme" },
    { data: "15 feb", nome: "Mezzamaratona Scandicci", distanza: "21 km", tipo: "Strada", localita: "Scandicci" },
    { data: "22 feb", nome: "Scarpinata Empolese", distanza: "18 km", tipo: "Strada", localita: "Empoli" },
  ],
  marzo: [
    { data: "1 mar", nome: "Scagliata Trail", distanza: "21 km", tipo: "Trail", localita: "Grosseto" },
    { data: "1 mar", nome: "Boar to run", distanza: "10 km", tipo: "Strada", localita: "Greve in Chianti" },
    { data: "8 mar", nome: "La Strapazza", distanza: "10 km", tipo: "Strada", localita: "Lastra a Signa" },
    { data: "15 mar", nome: "Trail delle Vie Cave", distanza: "21 km", tipo: "Trail", localita: "Pitigliano" },
    { data: "15 mar", nome: "Maratonina di Tavarnelle", distanza: "21 km", tipo: "Strada", localita: "Tavarnelle" },
  ],
};

function GareTable({ gare, mese }: { gare: Gara[]; mese: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-emerald-600">{mese} 2026</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Gara</th>
              <th className="p-3 text-left">Distanza</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Località</th>
            </tr>
          </thead>
          <tbody>
            {gare.map((gara, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-3 border-b">{gara.data}</td>
                <td className="p-3 border-b font-medium">{gara.nome}</td>
                <td className="p-3 border-b">{gara.distanza}</td>
                <td className="p-3 border-b">
                  <span className={`px-2 py-1 rounded text-sm ${gara.tipo === "Trail" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                    {gara.tipo}
                  </span>
                </td>
                <td className="p-3 border-b">{gara.localita}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Activity Plan 2026</h1>
          <p className="mt-2 text-emerald-100">Roadmap Podistica - Toscana</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Profilo Atleta</h2>
          <p className="text-gray-600">Range distanze: <span className="font-medium">10 km - 45 km trail</span></p>
        </div>

        <GareTable gare={gare.febbraio} mese="Febbraio" />
        <GareTable gare={gare.marzo} mese="Marzo" />
      </main>

      <footer className="bg-gray-800 text-gray-400 py-4 text-center">
        <p>Fonte: <a href="https://www.calendariopodismo.it/regione/toscana" className="text-emerald-400 hover:underline">Calendario Podismo Toscana</a></p>
      </footer>
    </div>
  );
}
