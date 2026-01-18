import { db } from "./firebase-admin";
import { OtpSchema } from "./schemas/otpSchema";

const OTP_COLLECTION = "email_otps";

export const saveOtp = async (email: string, otp: string) => {
  const data = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
  const parsed = OtpSchema.parse(data);
  await db.collection(OTP_COLLECTION).doc(email).set(parsed);
};

export const verifyOtp = async (email: string, otp: string) => {
  const doc = await db.collection(OTP_COLLECTION).doc(email).get();
  if (!doc.exists) return false;

  const parsed = OtpSchema.safeParse(doc.data());
  if (!parsed.success) return false;

  const isValid = parsed.data.otp === otp && Date.now() < parsed.data.expiresAt;
  if (isValid) await db.collection(OTP_COLLECTION).doc(email).delete();
  return isValid;
};

// Remove all expired OTPs from Firestore
export const removeExpiredOtps = async () => {
  const now = Date.now();
  const snapshot = await db.collection(OTP_COLLECTION).get();
  const batch = db.batch();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const parsed = OtpSchema.safeParse(data);
    if (parsed.success && parsed.data.expiresAt < now) {
      batch.delete(doc.ref);
    }
  });

  await batch.commit();
};
