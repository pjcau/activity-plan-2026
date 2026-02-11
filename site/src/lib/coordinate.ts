export const FIRENZE = { lat: 43.7696, lon: 11.2558 };

export const coordLocalita: Record<string, { lat: number; lon: number }> = {
  "Firenze": { lat: 43.7696, lon: 11.2558 },
  "Montalcino": { lat: 43.0588, lon: 11.4908 },
  "Agliana": { lat: 43.9042, lon: 11.0069 },
  "Sesto Fiorentino": { lat: 43.8325, lon: 11.2000 },
  "Palazzuolo sul Senio": { lat: 44.1125, lon: 11.5467 },
  "Venturina Terme": { lat: 43.0267, lon: 10.6033 },
  "Scandicci": { lat: 43.7536, lon: 11.1892 },
  "Castelnuovo Berardenga": { lat: 43.3467, lon: 11.5042 },
  "Borgo San Lorenzo": { lat: 43.9542, lon: 11.3867 },
  "Grosseto": { lat: 42.7633, lon: 11.1133 },
  "Castiglione della Pescaia": { lat: 42.7642, lon: 10.8833 },
  "Pisa": { lat: 43.7228, lon: 10.4017 },
  "Pitigliano": { lat: 42.6347, lon: 11.6703 },
  "Tavarnelle": { lat: 43.5567, lon: 11.1733 },
  "Abbadia San Salvatore": { lat: 42.8817, lon: 11.6775 },
  "Asciano": { lat: 43.2342, lon: 11.5600 },
  "Lucca": { lat: 43.8429, lon: 10.5027 },
  "Calci": { lat: 43.7250, lon: 10.5150 },
  "Castelnuovo di Garfagnana": { lat: 44.1108, lon: 10.4117 },
  "Scarperia": { lat: 43.9942, lon: 11.3547 },
  "Empoli": { lat: 43.7192, lon: 10.9458 },
  "Greve in Chianti": { lat: 43.5833, lon: 11.3167 },
  "Lastra a Signa": { lat: 43.7700, lon: 11.1050 },
  "Siena": { lat: 43.3188, lon: 11.3308 },
  "Arezzo": { lat: 43.4633, lon: 11.8797 },
  "Pistoia": { lat: 43.9333, lon: 10.9167 },
  "Prato": { lat: 43.8808, lon: 11.0967 },
  "Livorno": { lat: 43.5500, lon: 10.3167 },
  "Massa": { lat: 44.0342, lon: 10.1392 },
  "Carrara": { lat: 44.0792, lon: 10.0997 },
  "Volterra": { lat: 43.4008, lon: 10.8606 },
  "San Gimignano": { lat: 43.4678, lon: 11.0433 },
  "Cortona": { lat: 43.2756, lon: 11.9858 },
  "Montepulciano": { lat: 43.0992, lon: 11.7836 },
  "Chiusi": { lat: 43.0167, lon: 11.9500 },
  "Pienza": { lat: 43.0767, lon: 11.6789 },
  "Orbetello": { lat: 42.4400, lon: 11.2133 },
  "Porto Ercole": { lat: 42.3953, lon: 11.2061 },
  "Pietrasanta": { lat: 43.9592, lon: 10.2275 },
  "Seravezza": { lat: 43.9933, lon: 10.2283 },
  "Poppi": { lat: 43.7200, lon: 11.7633 },
  "Massa Marittima": { lat: 43.0500, lon: 10.8917 },
  "Portoferraio": { lat: 42.8147, lon: 10.3192 },
  "Loro Ciuffenna": { lat: 43.5928, lon: 11.6297 },
  "Santa Fiora": { lat: 42.8317, lon: 11.5850 },
  "Fiesole": { lat: 43.8064, lon: 11.2942 },
  "Abetone": { lat: 44.1483, lon: 10.6600 },
  "Pontremoli": { lat: 44.3758, lon: 9.8789 },
  "Minucciano": { lat: 44.1700, lon: 10.2083 },
  "Cetona": { lat: 42.9617, lon: 11.8000 },
  "Monticiano": { lat: 43.1333, lon: 11.1833 },
  "Donoratico": { lat: 43.1267, lon: 10.5967 },
  "Montevarchi": { lat: 43.5231, lon: 11.5697 },
  "Buonconvento": { lat: 43.1333, lon: 11.4833 },
  "Poggibonsi": { lat: 43.4667, lon: 11.1500 },
  "Radda in Chianti": { lat: 43.4867, lon: 11.3733 },
  "Lido di Camaiore": { lat: 43.9167, lon: 10.2500 },
};

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function normalizeLocalita(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, "")   // "(FI)", "(GR)" ecc.
    .replace(/\s+/g, " ");
}

const distanzaDaFirenze: Record<string, number> = {};
const normalizedDistanza: Record<string, number> = {};
for (const [nome, coord] of Object.entries(coordLocalita)) {
  const km = Math.round(haversineKm(FIRENZE, coord));
  distanzaDaFirenze[nome] = km;
  normalizedDistanza[normalizeLocalita(nome)] = km;
}

export function getDistanzaDaFirenze(localita: string): number | null {
  if (distanzaDaFirenze[localita] !== undefined) return distanzaDaFirenze[localita];
  return normalizedDistanza[normalizeLocalita(localita)] ?? null;
}

export function getCoordinate(localita: string): { lat: number; lon: number } | null {
  return coordLocalita[localita] ?? null;
}
