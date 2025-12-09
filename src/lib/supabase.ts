// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Legg til type-definisjoner for Vite's import.meta.env slik at TypeScript kjenner variablene
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Hent fra Vite-env (må starte med VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Midlertidig logging for å verifisere at de faktisk finnes
console.log("SUPABASE URL:", supabaseUrl);
console.log(
  "SUPABASE ANON KEY:",
  supabaseAnonKey ? supabaseAnonKey.slice(0, 8) + "..." : "Mangler"
);

// Hvis noe mangler: kast feil i stedet for å bruke placeholder
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase er ikke konfigurert. Sjekk VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
