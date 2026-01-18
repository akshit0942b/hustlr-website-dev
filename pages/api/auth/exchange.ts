import { createToken } from "@/src/lib/jwt";
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ status: 405, message: "METHOD NOT ALLOWED" });
    return;
  }

  try {
    const { access_token } = req.body;

    const { data, error } = await supabaseAdmin.auth.getUser(access_token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Issue your own JWT
    const token = createToken(data.user.email!);

    res.setHeader(
      "Set-Cookie",
      serialize("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "lax",
      })
    );

    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
}
