import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Tanix Draw" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your Tanix Draw account",
    html: `
      <div style="font-family: sans-serif; max-width: 420px; margin: auto;">
        <h2>Verify your email</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendResetOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Tanix Draw" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your Tanix Draw password",
    html: `
      <div style="font-family: sans-serif; max-width: 420px; margin: auto;">
        <h2>Reset your password</h2>
        <p>Your password reset OTP is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};