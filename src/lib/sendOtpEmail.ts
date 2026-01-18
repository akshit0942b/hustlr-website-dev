import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendOtpEmail = async (email: string, otp: string) => {
  console.log(`sending otp email to ${email}......`);
  const res = await resend.emails.send({
    from: "hustlr@kritikmc.com",
    to: email,
    subject: "OTP for email verification",
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
  });
  console.log(res);
};
