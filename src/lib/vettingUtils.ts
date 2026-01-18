import {
  UploadFormFields as FormFields,
  GetVettingProgressResponse,
  Stage2Data,
  Stage2ProjectSubmit,
  SupabaseVettingData,
} from "./schemas/formSchema";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

import { db } from "./firebase-admin";
import { NextApiRequest } from "next";
import { verifyToken } from "@/src/lib/jwt";

// const USERS_COLLECTION = "users";
// const USER_DATA_SUBCOLLECTION = "userData";

// export const saveFinalVettingData = async (stageData: FormFields) => {
//   if (!stageData.email) {
//     throw new Error("Email is required to save vetting progress.");
//   }
//   const userRef = db.collection(USERS_COLLECTION).doc(stageData.email);
//   const vettingDataRef = userRef
//     .collection(USER_DATA_SUBCOLLECTION)
//     .doc("vettingData");

//   await vettingDataRef.set({ isComplete: true, ...stageData }, { merge: true });
// };

// export const saveOrUpdateVettingProgress = async (stageData: FormFields) => {
//   if (!stageData.email) {
//     throw new Error("Email is required to save vetting progress.");
//   }
//   const userRef = db.collection(USERS_COLLECTION).doc(stageData.email);
//   const vettingDataRef = userRef
//     .collection(USER_DATA_SUBCOLLECTION)
//     .doc("vettingData");

//   await vettingDataRef.set(
//     { isComplete: false, ...stageData },
//     { merge: true }
//   );
// };

export function extractEmailFromAuthHeader(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    return typeof payload === "string" ? null : payload.email;
  } catch {
    return null;
  }
}

export function prepareVettingData(raw: any): SupabaseVettingData {
  const cgpaAsNumber =
    typeof raw.cgpa === "string" ? parseFloat(raw.cgpa) : raw.cgpa;

  return {
    ...raw,
    cgpa: cgpaAsNumber,
    isComplete: false,
  };
}

export async function checkIfExists(email: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("vettingapplications")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function markAsComplete(data: SupabaseVettingData) {
  const { error } = await supabaseAdmin
    .from("vettingapplications")
    .update({
      ...data,
      cgpa: parseFloat(data.cgpa as any),
      isComplete: true,
      status: "under_review",
    })
    .eq("email", data.email);

  if (error) throw error;
}

export async function updateVettingData(
  data:
    | SupabaseVettingData
    | Stage2Data
    | (Stage2ProjectSubmit & { email: string })
) {
  const { error } = await supabaseAdmin
    .from("vettingapplications")
    .update(data)
    .eq("email", data.email);

  if (error) throw error;
}

export async function insertVettingData(data: SupabaseVettingData) {
  const { error } = await supabaseAdmin
    .from("vettingapplications")
    .insert(data);

  if (error) throw error;
}

export const getVettingProgress = async (
  email: string
): Promise<GetVettingProgressResponse> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("vettingapplications")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return { success: false };

    return {
      success: true,
      data: {
        ...data,
      },
    };
  } catch (err) {
    console.error("getVettingProgress failed:", err);
    return { success: false };
  }
};
