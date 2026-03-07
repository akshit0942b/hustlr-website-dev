/**
 * Gemini API Diagnostics
 * Tests the API key against the REST API directly to understand what's available.
 * 
 * Run: node scripts/diagnose-gemini.mjs
 */

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
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
console.log("");

// ─── Step 1: List available models ───
console.log("📋 Step 1: Listing available models via REST API...\n");
try {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  if (!res.ok) {
    const err = await res.text();
    console.log(`❌ List models failed (${res.status}): ${err.substring(0, 200)}`);
  } else {
    const data = await res.json();
    const models = data.models || [];
    console.log(`Found ${models.length} models. Relevant ones:\n`);
    const relevant = models.filter(m => 
      m.name.includes("gemini") && 
      m.supportedGenerationMethods?.includes("generateContent")
    );
    for (const m of relevant.slice(0, 15)) {
      console.log(`  ${m.name.padEnd(45)} ${m.displayName}`);
    }
    if (relevant.length > 15) {
      console.log(`  ... and ${relevant.length - 15} more`);
    }
  }
} catch (err) {
  console.log(`❌ List models error: ${err.message}`);
}

// ─── Step 2: Try generating content with various model names ───
console.log("\n\n🧪 Step 2: Testing generateContent with different model names...\n");

const modelsToTest = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro",
  "gemini-1.5-pro-latest",
  "gemini-pro",
  "gemini-2.5-flash-preview-05-20",
];

for (const modelName of modelsToTest) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say OK" }] }],
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "(empty)";
      console.log(`  ✅ ${modelName.padEnd(40)} → "${text.substring(0, 30)}"`);
    } else {
      const err = await res.json();
      const code = err.error?.code || res.status;
      const msg = err.error?.message?.substring(0, 80) || res.statusText;
      console.log(`  ❌ ${modelName.padEnd(40)} → ${code}: ${msg}`);
    }
  } catch (err) {
    console.log(`  ❌ ${modelName.padEnd(40)} → ${err.message.substring(0, 60)}`);
  }
}

// ─── Step 3: Try v1 instead of v1beta ───
console.log("\n\n🔄 Step 3: Trying v1 API (instead of v1beta)...\n");

for (const modelName of ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"]) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say OK" }] }],
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "(empty)";
      console.log(`  ✅ v1/${modelName.padEnd(35)} → "${text.substring(0, 30)}"`);
    } else {
      const err = await res.json();
      const code = err.error?.code || res.status;
      const msg = err.error?.message?.substring(0, 80) || res.statusText;
      console.log(`  ❌ v1/${modelName.padEnd(35)} → ${code}: ${msg}`);
    }
  } catch (err) {
    console.log(`  ❌ v1/${modelName.padEnd(35)} → ${err.message.substring(0, 60)}`);
  }
}

console.log("\nDone.\n");
