import type { NextApiRequest, NextApiResponse } from "next";
import {
  checkIfExists,
  extractEmailFromAuthHeader,
  updateVettingData,
} from "@/src/lib/vettingUtils";
import { sanity } from "@/sanity/lib/client";
import groq from "groq";
import { Stage2Data } from "@/src/lib/schemas/formSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const jwtEmail = extractEmailFromAuthHeader(req);
  if (!jwtEmail) {
    return res.status(401).json({ error: "Invalid or missing token" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (jwtEmail !== body.email) {
      return res.status(401).json({ error: "JWT and data email mismatch" });
    }

    const data: Stage2Data = body;
    const existing = await checkIfExists(data.email);

    if (!existing) {
      return res.status(401).json({
        success: false,
        message: "There is no user with given email id",
      });
    }

    const query = groq`*[_type == "testProject" && _id == $id][0]{ duration }`;
    const result = await sanity.fetch(query, {
      id: data.selectedProjectSanityId,
    });

    if (!result || !result.duration) {
      return res
        .status(400)
        .json({ error: "Invalid project ID or missing duration" });
    }

    const projectDeadline = new Date(
      Date.now() + result.duration * 24 * 60 * 60 * 1000
    ).toISOString();

    await updateVettingData({
      ...data,
      status: "round_2_project_selected",
      projectDeadline,
    });

    return res.status(200).json({ success: true, final: false });
  } catch (error) {
    console.error("Error saving project data:", error);
    return res
      .status(500)
      .json({ error: `Failed to update project selection: ${error}` });
  }
}
