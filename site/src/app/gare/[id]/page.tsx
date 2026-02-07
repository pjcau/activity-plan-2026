"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { getCoordinate, getDistanzaDaFirenze } from "@/lib/coordinate";

type GaraDettaglio = {
  id: number;
  data: string;
  nome: string;
  distanza: number;
  tipo: "Trail" | "Strada";
  localita: string;
  mese: number;
  fonti: string[];
  descrizione: string;
  link_sito: string;
  link_iscrizione: string;
  locandina_url: string;
  pdf_url: string;
  immagini: string[];
  competitiva: boolean;
  federazione: string;
};

export default function GaraDetail() {
  const { id } = useParams<{ id: string }>();
  const { supabase } = useAuth();
  const [gara, setGara] = useState<GaraDettaglio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !id) return;
    const load = async () => {
      const { data } = await supabase
        .from("gare")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setGara(data as GaraDettaglio);
      setLoading(false);
    };
    load();
  }, [supabase, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (!gara) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Gara non trovata</h2>
          <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
            Torna alle gare
          </Link>
        </main>
      </div>
    );
  }

  const coord = getCoordinate(gara.localita);
  const distFi = getDistanzaDaFirenze(gara.localita);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
            &larr; Tutte le gare
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex-1">{gara.nome}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                gara.tipo === "Trail"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {gara.tipo}
            </span>
            {gara.federazione && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                {gara.federazione}
              </span>
            )}
            {gara.competitiva && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                Competitiva
              </span>
            )}
          </div>

          {/* Info griglia */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Data</div>
              <div className="text-lg font-bold text-gray-800">{gara.data}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Distanza</div>
              <div className="text-lg font-bold text-gray-800">{gara.distanza} km</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Localit&agrave;</div>
              <div className="text-lg font-bold text-gray-800">{gara.localita}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Da Firenze</div>
              <div className="text-lg font-bold text-gray-800">
                {distFi !== null ? `${distFi} km` : "—"}
              </div>
            </div>
          </div>

          {/* Fonti */}
          <div className="flex gap-2">
            {gara.fonti.map((f) => (
              <span
                key={f}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  f === "Calendario Podismo"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Link e azioni */}
        {(gara.link_sito || gara.link_iscrizione || gara.pdf_url) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Link</h2>
            <div className="flex flex-wrap gap-3">
              {gara.link_sito && (
                <a
                  href={gara.link_sito}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  Sito ufficiale &#8599;
                </a>
              )}
              {gara.link_iscrizione && (
                <a
                  href={gara.link_iscrizione}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Iscrizione &#8599;
                </a>
              )}
              {gara.pdf_url && (
                <a
                  href={gara.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Regolamento PDF &#8599;
                </a>
              )}
            </div>
          </div>
        )}

        {/* Descrizione */}
        {gara.descrizione && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Descrizione</h2>
            <p className="text-gray-600 leading-relaxed">{gara.descrizione}</p>
          </div>
        )}

        {/* Immagini (locandina + galleria, senza duplicati) */}
        {(() => {
          const allImgs: string[] = [];
          if (gara.locandina_url && !allImgs.includes(gara.locandina_url)) allImgs.push(gara.locandina_url);
          if (gara.immagini) {
            for (const url of gara.immagini) {
              if (!allImgs.includes(url)) allImgs.push(url);
            }
          }
          if (allImgs.length === 0) return null;
          return (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Immagini</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allImgs.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${gara.nome} - ${i + 1}`}
                    className="w-full rounded-lg shadow"
                  />
                ))}
              </div>
            </div>
          );
        })()}

        {/* Mappa */}
        {coord && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Posizione: {gara.localita}
            </h2>
            <div className="rounded-lg overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${coord.lat},${coord.lon}&z=13&output=embed`}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mappa ${gara.localita}`}
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Apri in Google Maps &#8599;
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
