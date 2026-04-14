import { describe, it, expect } from "vitest";
import {
  parseDataGara,
  garaKey,
  formatGaraData,
  MESI_SHORT_TO_NUM,
  buildUserGaraInsert,
  resolveGaraLink,
} from "./gare";

describe("parseDataGara", () => {
  it("parses '15 mar' into a Date in the given year", () => {
    const d = parseDataGara("15 mar", 2026);
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2026);
    expect(d!.getMonth()).toBe(2);
    expect(d!.getDate()).toBe(15);
  });

  it("is case-insensitive on month", () => {
    const d = parseDataGara("1 DIC");
    expect(d!.getMonth()).toBe(11);
  });

  it("returns null for malformed input", () => {
    expect(parseDataGara("")).toBeNull();
    expect(parseDataGara("15")).toBeNull();
    expect(parseDataGara("xx mar")).toBeNull();
    expect(parseDataGara("15 xyz")).toBeNull();
  });

  it("tolerates extra whitespace", () => {
    const d = parseDataGara("  7   giu  ");
    expect(d!.getMonth()).toBe(5);
    expect(d!.getDate()).toBe(7);
  });
});

describe("garaKey", () => {
  it("uses nome::data as the stable key", () => {
    expect(garaKey({ nome: "Maratona di Firenze", data: "29 nov" })).toBe(
      "Maratona di Firenze::29 nov"
    );
  });

  it("produces different keys for same name on different dates", () => {
    const a = garaKey({ nome: "Run", data: "1 gen" });
    const b = garaKey({ nome: "Run", data: "2 gen" });
    expect(a).not.toBe(b);
  });
});

describe("formatGaraData", () => {
  it("converts an ISO date into the gara_data short format", () => {
    const { giorno, mese, garaData } = formatGaraData("2026-03-15");
    expect(giorno).toBe(15);
    expect(mese).toBe(3);
    expect(garaData).toBe("15 mar");
  });
});

describe("MESI_SHORT_TO_NUM", () => {
  it("maps all 12 months", () => {
    expect(Object.keys(MESI_SHORT_TO_NUM)).toHaveLength(12);
  });
});

describe("buildUserGaraInsert", () => {
  const gara = {
    nome: "Maratona di Firenze",
    data: "29 nov",
    distanza: 42,
    tipo: "Strada" as const,
    localita: "Firenze (FI)",
    mese: 11,
  };

  it("returns the correct payload shape", () => {
    const payload = buildUserGaraInsert("user-abc", gara);
    expect(payload).toEqual({
      user_id: "user-abc",
      gara_nome: "Maratona di Firenze",
      gara_data: "29 nov",
      gara_distanza: 42,
      gara_tipo: "Strada",
      gara_localita: "Firenze (FI)",
      gara_mese: 11,
    });
  });

  it("does NOT include gara_id (regression: column missing in schema caused PGRST204)", () => {
    const payload = buildUserGaraInsert("user-abc", gara);
    expect(payload).not.toHaveProperty("gara_id");
  });

  it("preserves Trail tipo", () => {
    const payload = buildUserGaraInsert("u", { ...gara, tipo: "Trail" });
    expect(payload.gara_tipo).toBe("Trail");
  });
});

describe("resolveGaraLink", () => {
  it("uses gara_id directly when present", () => {
    const link = resolveGaraLink(
      { gara_id: 42, gara_nome: "X", gara_data: "1 gen" },
      {},
    );
    expect(link).toBe("/gare/42");
  });

  it("falls back to name::data map when gara_id is null", () => {
    const link = resolveGaraLink(
      { gara_id: null, gara_nome: "X", gara_data: "1 gen" },
      { "X::1 gen": 99 },
    );
    expect(link).toBe("/gare/99");
  });

  it("returns null when nothing resolves", () => {
    const link = resolveGaraLink(
      { gara_id: null, gara_nome: "Unknown", gara_data: "1 gen" },
      {},
    );
    expect(link).toBeNull();
  });
});

describe("toggleGara key round-trip", () => {
  it("saved key matches what delete filter would look up", () => {
    const gara = { nome: "Trail del Mugello", data: "10 mag" };
    const key = garaKey(gara);
    const [nome, data] = key.split("::");
    expect(nome).toBe(gara.nome);
    expect(data).toBe(gara.data);
  });
});
