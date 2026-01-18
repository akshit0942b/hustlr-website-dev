import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminToken } from "@/src/lib/jwt";
import { firebaseAdminAuth } from "@/src/lib/firebase-admin";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken)
    return res.status(401).json({ error: "No Firebase ID token provided" });

  try {
    const decoded = await firebaseAdminAuth.verifyIdToken(idToken);
    const email = decoded.email;
    const token = createAdminToken(email!);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        sameSite: "lax",
      })
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid Firebase token" });
  }
}
