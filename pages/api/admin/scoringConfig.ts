import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/src/lib/jwt";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

const VALID_CATEGORIES = new Set([
  "cgpa",
  "cp_platform",
  "cp_competitions",
  "research",
  "skills",
  "internships",
  "projects",
  "hackathons",
  "open_source",
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ─── Auth ───
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Missing or invalid authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    if (typeof payload === "string" || payload.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Forbidden: Admin access required" });
    }
  } catch {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired token" });
  }

  // ─── GET: return all config rows ───
  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("scoring_config")
      .select("id, category, weight, enabled, updated_at")
      .order("weight", { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    const totalWeight = data
      .filter((r) => r.enabled)
      .reduce((sum, r) => sum + Number(r.weight), 0);

    return res.status(200).json({ success: true, data, totalWeight });
  }

  // ─── PUT: update configs ───
  if (req.method === "PUT") {
    const { configs } = req.body;

    if (!Array.isArray(configs) || configs.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "configs array is required" });
    }

    // Validate every entry
    const seen = new Set<string>();
    for (const c of configs) {
      if (!c.category || !VALID_CATEGORIES.has(c.category)) {
        return res.status(400).json({
          success: false,
          error: `Invalid category: ${c.category}`,
        });
      }
      if (seen.has(c.category)) {
        return res.status(400).json({
          success: false,
          error: `Duplicate category: ${c.category}`,
        });
      }
      seen.add(c.category);

      const weight = Number(c.weight);
      if (isNaN(weight) || weight <= 0 || weight > 100) {
        return res.status(400).json({
          success: false,
          error: `Weight for ${c.category} must be between 1 and 100, got ${c.weight}`,
        });
      }
      if (typeof c.enabled !== "boolean") {
        return res.status(400).json({
          success: false,
          error: `enabled for ${c.category} must be a boolean`,
        });
      }
    }

    // Update each config row
    const errors: string[] = [];
    for (const c of configs) {
      const { error } = await supabaseAdmin
        .from("scoring_config")
        .update({
          weight: Number(c.weight),
          enabled: c.enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("category", c.category);

      if (error) {
        errors.push(`${c.category}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return res
        .status(500)
        .json({ success: false, error: errors.join("; ") });
    }

    // Return updated state
    const { data, error: fetchError } = await supabaseAdmin
      .from("scoring_config")
      .select("id, category, weight, enabled, updated_at")
      .order("weight", { ascending: false });

    if (fetchError) {
      return res
        .status(500)
        .json({ success: false, error: fetchError.message });
    }

    const totalWeight = data!
      .filter((r) => r.enabled)
      .reduce((sum, r) => sum + Number(r.weight), 0);

    return res.status(200).json({ success: true, data, totalWeight });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
