const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_URL || !ACCESS_TOKEN) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

// Estrai project ref da URL (https://xxx.supabase.co)
const PROJECT_REF = SUPABASE_URL.replace("https://", "").split(".")[0];

async function executeSQL(sql: string, label: string) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${label}] SQL failed (${res.status}): ${text}`);
  }
  console.log(`  [OK] ${label}`);
  return res.json();
}

async function main() {
  console.log("=== Creazione tabelle contenuto ===\n");

  // --- libri ---
  console.log("1. Tabella libri");
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS libri (
      id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      titolo      TEXT NOT NULL,
      sottotitolo TEXT,
      autori      TEXT NOT NULL,
      anno        INTEGER NOT NULL,
      descrizione TEXT,
      perche      TEXT,
      link_amazon TEXT,
      lingua      TEXT NOT NULL DEFAULT 'Italiano',
      ordine      INTEGER NOT NULL DEFAULT 0
    );
  `, "CREATE libri");
  await executeSQL(`ALTER TABLE libri ENABLE ROW LEVEL SECURITY;`, "RLS libri");
  await executeSQL(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'libri' AND policyname = 'Allow anon read libri') THEN
        CREATE POLICY "Allow anon read libri" ON libri FOR SELECT USING (true);
      END IF;
    END $$;
  `, "POLICY libri");

  // --- food_power_tips ---
  console.log("2. Tabella food_power_tips");
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS food_power_tips (
      id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nutriente TEXT NOT NULL,
      fonti     TEXT NOT NULL,
      tip       TEXT NOT NULL,
      colore    TEXT NOT NULL,
      ordine    INTEGER NOT NULL DEFAULT 0
    );
  `, "CREATE food_power_tips");
  await executeSQL(`ALTER TABLE food_power_tips ENABLE ROW LEVEL SECURITY;`, "RLS food_power_tips");
  await executeSQL(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'food_power_tips' AND policyname = 'Allow anon read food_power_tips') THEN
        CREATE POLICY "Allow anon read food_power_tips" ON food_power_tips FOR SELECT USING (true);
      END IF;
    END $$;
  `, "POLICY food_power_tips");

  // --- capisaldi ---
  console.log("3. Tabella capisaldi");
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS capisaldi (
      id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      titolo      TEXT NOT NULL,
      descrizione TEXT NOT NULL,
      esempi      TEXT[] NOT NULL,
      ordine      INTEGER NOT NULL DEFAULT 0
    );
  `, "CREATE capisaldi");
  await executeSQL(`ALTER TABLE capisaldi ENABLE ROW LEVEL SECURITY;`, "RLS capisaldi");
  await executeSQL(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'capisaldi' AND policyname = 'Allow anon read capisaldi') THEN
        CREATE POLICY "Allow anon read capisaldi" ON capisaldi FOR SELECT USING (true);
      END IF;
    END $$;
  `, "POLICY capisaldi");

  // --- integrazioni ---
  console.log("4. Tabella integrazioni");
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS integrazioni (
      id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nome   TEXT NOT NULL,
      note   TEXT,
      ordine INTEGER NOT NULL DEFAULT 0
    );
  `, "CREATE integrazioni");
  await executeSQL(`ALTER TABLE integrazioni ENABLE ROW LEVEL SECURITY;`, "RLS integrazioni");
  await executeSQL(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'integrazioni' AND policyname = 'Allow anon read integrazioni') THEN
        CREATE POLICY "Allow anon read integrazioni" ON integrazioni FOR SELECT USING (true);
      END IF;
    END $$;
  `, "POLICY integrazioni");

  console.log("\nTutte le tabelle create con successo!");
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
