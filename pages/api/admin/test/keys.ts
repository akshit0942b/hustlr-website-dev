import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/src/lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  // Admin auth check (same pattern as all admin routes)
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    if (typeof payload === "string" || payload.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }
  } catch {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired token" });
  }

  const results: Record<string, { status: string; message?: string; rateLimit?: object }> = {};

  // --- Test Gemini API ---
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      results.gemini = {
        status: "error",
        message: "GEMINI_API_KEY not set in environment",
      };
    } else {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(
        "Respond with exactly one word: OK"
      );
      const text = result.response.text().trim();
      results.gemini = {
        status: "ok",
        message: `Gemini responded: "${text.substring(0, 50)}"`,
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    results.gemini = { status: "error", message };
  }

  // --- Test GitHub API ---
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      results.github = {
        status: "error",
        message: "GITHUB_TOKEN not set in environment",
      };
    } else {
      const response = await fetch("https://api.github.com/rate_limit", {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "hustlr-scoring",
        },
      });

      if (!response.ok) {
        results.github = {
          status: "error",
          message: `GitHub API returned ${response.status}: ${response.statusText}`,
        };
      } else {
        const data = await response.json();
        results.github = {
          status: "ok",
          message: `Authenticated. ${data.rate.remaining}/${data.rate.limit} requests remaining.`,
          rateLimit: {
            limit: data.rate.limit,
            remaining: data.rate.remaining,
            resetsAt: new Date(data.rate.reset * 1000).toISOString(),
          },
        };
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    results.github = { status: "error", message };
  }

  const allOk = Object.values(results).every((r) => r.status === "ok");

  return res.status(allOk ? 200 : 500).json({
    success: allOk,
    results,
    testedAt: new Date().toISOString(),
  });
}
