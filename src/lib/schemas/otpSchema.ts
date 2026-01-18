import { z } from "zod";

export const OtpSchema = z.object({
  otp: z.string().length(6),
  expiresAt: z.number(),
});

export type Otp = z.infer<typeof OtpSchema>;
