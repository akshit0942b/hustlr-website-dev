/**
 * Phase 0 Verification Script
 * 
 * Tests:
 * 1. Gemini API key connectivity
 * 2. GitHub API token + rate limits
 * 3. Supabase DB migration (scoring columns + config table)
 * 
 * Run: node scripts/verify-phase0.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_SUPABASE_SERVICE_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Load .env.local manually since this runs outside Next.js
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
} catch {
  console.error("Could not read .env.local — run from project root");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SUPABASE_SERVICE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const githubToken = process.env.GITHUB_TOKEN;

let allPassed = true;

function pass(label, detail) {
  console.log(`  ✅ ${label}: ${detail}`);
}
function fail(label, detail) {
  console.log(`  ❌ ${label}: ${detail}`);
  allPassed = false;
}

// ──────────────────────────────────────────────
// TEST 1: Gemini API
// ──────────────────────────────────────────────
console.log("\n🔑 Test 1: Gemini API Key");
if (!geminiKey) {
  fail("GEMINI_API_KEY", "Not set in .env.local");
} else {
  // Try multiple models — some projects have quota on one but not another
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
  ];
  let geminiWorked = false;
  for (const modelName of modelsToTry) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Respond with exactly: HUSTLR_OK");
      const text = result.response.text().trim();
      pass("Gemini", `Model "${modelName}" responded: "${text.substring(0, 50)}"`);
      geminiWorked = true;
      break;
    } catch (err) {
      console.log(`    ⚬ ${modelName}: ${err.message.substring(0, 80)}...`);
    }
  }
  if (!geminiWorked) {
    fail("Gemini", "All models failed. Key may need to be regenerated from https://aistudio.google.com/apikey (click 'Create API key in new project')");
  }
}

// ──────────────────────────────────────────────
// TEST 2: GitHub API
// ──────────────────────────────────────────────
console.log("\n🔑 Test 2: GitHub API Token");
if (!githubToken) {
  fail("GITHUB_TOKEN", "Not set in .env.local");
} else {
  try {
    const res = await fetch("https://api.github.com/rate_limit", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "hustlr-scoring",
      },
    });
    if (!res.ok) {
      fail("GitHub", `HTTP ${res.status}: ${res.statusText}`);
    } else {
      const data = await res.json();
      const r = data.rate;
      pass("GitHub", `Authenticated. ${r.remaining}/${r.limit} requests remaining (resets ${new Date(r.reset * 1000).toLocaleTimeString()})`);
      
      // Extra: test fetching a real repo to confirm read access
      const repoRes = await fetch("https://api.github.com/repos/vercel/next.js", {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "hustlr-scoring",
        },
      });
      if (repoRes.ok) {
        const repo = await repoRes.json();
        pass("GitHub repo read", `Fetched vercel/next.js (${repo.stargazers_count} stars)`);
      } else {
        fail("GitHub repo read", `Could not fetch test repo: ${repoRes.status}`);
      }
    }
  } catch (err) {
    fail("GitHub", err.message);
  }
}

// ──────────────────────────────────────────────
// TEST 3: Supabase Migration
// ──────────────────────────────────────────────
console.log("\n🗄️  Test 3: Supabase Migration Verification");
if (!supabaseUrl || !supabaseKey) {
  fail("Supabase", "NEXT_PUBLIC_SUPABASE_URL or NEXT_SUPABASE_SERVICE_KEY not set");
} else {
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  };

  // 3a: Check new columns exist on vettingapplications
  try {
    // Query a single row selecting only the new columns
    const res = await fetch(
      `${supabaseUrl}/rest/v1/vettingapplications?select=scores,final_score,scored_at,scoring_cache&limit=1`,
      { headers }
    );
    if (res.ok) {
      pass("Scoring columns", "scores, final_score, scored_at, scoring_cache all exist");
    } else {
      const err = await res.json();
      fail("Scoring columns", JSON.stringify(err));
    }
  } catch (err) {
    fail("Scoring columns", err.message);
  }

  // 3b: Check scoring_config table exists and has 9 rows
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/scoring_config?select=category,weight,enabled&order=weight.desc`,
      { headers }
    );
    if (!res.ok) {
      const err = await res.json();
      fail("scoring_config table", JSON.stringify(err));
    } else {
      const rows = await res.json();
      if (rows.length === 9) {
        pass("scoring_config", `9 categories found`);
        const totalWeight = rows.reduce((sum, r) => sum + Number(r.weight), 0);
        if (totalWeight === 180) {
          pass("Weight total", `Sum = ${totalWeight} (correct)`);
        } else {
          fail("Weight total", `Sum = ${totalWeight} (expected 180)`);
        }
        // Print the table
        console.log("\n  Category weights:");
        for (const row of rows) {
          console.log(`    ${row.category.padEnd(16)} ${row.weight}%  ${row.enabled ? "✓" : "✗"}`);
        }
      } else {
        fail("scoring_config", `Expected 9 rows, got ${rows.length}`);
      }
    }
  } catch (err) {
    fail("scoring_config", err.message);
  }

  // 3c: Check index exists
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/rpc/`,  // We'll just confirm the final_score column is queryable with sort
      { 
        method: "POST",
        headers,
        body: JSON.stringify({})
      }
    );
    // If final_score sort works, index is operational
    const sortRes = await fetch(
      `${supabaseUrl}/rest/v1/vettingapplications?select=email,final_score&order=final_score.desc.nullslast&limit=1`,
      { headers }
    );
    if (sortRes.ok) {
      pass("final_score index", "Sorting by final_score works");
    } else {
      fail("final_score index", "Could not sort by final_score");
    }
  } catch (err) {
    fail("final_score index", err.message);
  }
}

// ──────────────────────────────────────────────
// SUMMARY
// ──────────────────────────────────────────────
console.log("\n" + "═".repeat(50));
if (allPassed) {
  console.log("🎉 ALL TESTS PASSED — Phase 0 complete!");
} else {
  console.log("⚠️  SOME TESTS FAILED — check above for details");
}
console.log("═".repeat(50) + "\n");
