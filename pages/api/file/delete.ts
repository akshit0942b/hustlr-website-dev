import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const field = req.query.field as string;
  const email = req.query.email as string;

  const validFields = ["studentId", "resume", "transcript"];
  if (!field || !email || !validFields.includes(field)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const column = `${field}`;

  try {
    // 1. Fetch the file path from DB
    const { data, error: fetchError } = await supabaseAdmin
      .from("vettingapplications")
      .select(column)
      .eq("email", email)
      .single<{ [key: string]: string | null }>();

    if (fetchError || !data || !data[column]) {
      return res.status(404).json({ error: "File not found in database" });
    }

    const filePath = data[column];

    // 2. Delete from storage
    const { error: deleteError } = await supabaseAdmin.storage
      .from("vetting-files-storage")
      .remove([filePath]);

    if (deleteError) {
      return res.status(500).json({ error: "Failed to delete from storage" });
    }

    // 3. Clear URL from database
    const { error: updateError } = await supabaseAdmin
      .from("vettingapplications")
      .update({ [column]: null })
      .eq("email", email);

    if (updateError) {
      return res.status(500).json({ error: "Failed to update database" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Delete API error:", err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
