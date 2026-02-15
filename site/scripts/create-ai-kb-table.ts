const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_URL || !ACCESS_TOKEN) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

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
  console.log("=== Creazione tabella ai_knowledge_base ===\n");

  await executeSQL(`
    CREATE TABLE IF NOT EXISTS ai_knowledge_base (
      id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      categoria TEXT NOT NULL,
      domande   TEXT[] NOT NULL,
      risposta  TEXT NOT NULL,
      fonte     TEXT,
      ordine    INTEGER NOT NULL DEFAULT 0
    );
  `, "CREATE ai_knowledge_base");

  await executeSQL(
    `ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;`,
    "RLS ai_knowledge_base"
  );

  await executeSQL(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_knowledge_base' AND policyname = 'Allow anon read ai_knowledge_base') THEN
        CREATE POLICY "Allow anon read ai_knowledge_base" ON ai_knowledge_base FOR SELECT USING (true);
      END IF;
    END $$;
  `, "POLICY ai_knowledge_base");

  console.log("\nTabella creata con successo!");
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
