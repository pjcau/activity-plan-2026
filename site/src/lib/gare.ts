export const MESI_SHORT_TO_NUM: Record<string, number> = {
  gen: 0, feb: 1, mar: 2, apr: 3, mag: 4, giu: 5,
  lug: 6, ago: 7, set: 8, ott: 9, nov: 10, dic: 11,
};

export const MESI_SHORT: Record<number, string> = {
  1: "gen", 2: "feb", 3: "mar", 4: "apr", 5: "mag", 6: "giu",
  7: "lug", 8: "ago", 9: "set", 10: "ott", 11: "nov", 12: "dic",
};

export function parseDataGara(data: string, year = 2026): Date | null {
  const parts = data.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const giorno = parseInt(parts[0]);
  const mese = MESI_SHORT_TO_NUM[parts[1].toLowerCase()];
  if (!giorno || mese === undefined) return null;
  return new Date(year, mese, giorno);
}

export function garaKey(gara: { nome: string; data: string }): string {
  return `${gara.nome}::${gara.data}`;
}

export function formatGaraData(isoDate: string): { giorno: number; mese: number; garaData: string } {
  const date = new Date(isoDate);
  const giorno = date.getDate();
  const mese = date.getMonth() + 1;
  return { giorno, mese, garaData: `${giorno} ${MESI_SHORT[mese]}` };
}

export type GaraForInsert = {
  nome: string;
  data: string;
  distanza: number;
  tipo: "Strada" | "Trail";
  localita: string;
  mese: number;
};

export function buildUserGaraInsert(userId: string, gara: GaraForInsert) {
  return {
    user_id: userId,
    gara_nome: gara.nome,
    gara_data: gara.data,
    gara_distanza: gara.distanza,
    gara_tipo: gara.tipo,
    gara_localita: gara.localita,
    gara_mese: gara.mese,
  };
}

export function resolveGaraLink(
  row: { gara_id: number | null; gara_nome: string; gara_data: string },
  garaIdMap: Record<string, number>,
): string | null {
  const id = row.gara_id || garaIdMap[`${row.gara_nome}::${row.gara_data}`];
  return id ? `/gare/${id}` : null;
}
