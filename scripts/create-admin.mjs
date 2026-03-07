/**
 * Create a Firebase Auth admin user using the Admin SDK.
 * Uses the service account key from .env.local — no console access needed.
 *
 * Usage: node scripts/create-admin.mjs your-email@gmail.com your-password
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load .env.local
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
  console.error("Could not read .env.local");
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log("Usage: node scripts/create-admin.mjs <email> <password>");
  console.log("Example: node scripts/create-admin.mjs admin@hustlr.com MyPass123!");
  process.exit(1);
}

if (password.length < 6) {
  console.log("Password must be at least 6 characters");
  process.exit(1);
}

const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIRESTORE_API_SECRET);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

try {
  // Check if user already exists
  try {
    const existing = await auth.getUserByEmail(email);
    console.log(`\n✅ User already exists!`);
    console.log(`   Email: ${existing.email}`);
    console.log(`   UID:   ${existing.uid}`);
    console.log(`\n   You can log in at /admin/login with this email + password.`);
    console.log(`   If you forgot the password, run this script again with --reset flag.\n`);
    
    if (process.argv[4] === "--reset") {
      await auth.updateUser(existing.uid, { password });
      console.log(`   🔄 Password has been reset to the one you provided.\n`);
    }
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      // Create new user
      const user = await auth.createUser({
        email,
        password,
        emailVerified: true,
      });
      console.log(`\n✅ Admin user created!`);
      console.log(`   Email: ${user.email}`);
      console.log(`   UID:   ${user.uid}`);
      console.log(`\n   Now go to localhost:3000/admin/login and sign in with:`);
      console.log(`   Email:    ${email}`);
      console.log(`   Password: (the one you just provided)\n`);
    } else {
      throw err;
    }
  }
} catch (err) {
  console.error("\n❌ Error:", err.message);
}

process.exit(0);
