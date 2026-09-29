// import nodemailer from "nodemailer";
// import "dotenv/config";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendOtpEmail = async (toEmail, otp) => {
//   const mailOptions = {
//     from: `"Tanix Draw" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: "Verify your Tanix Draw account",
//     html: `
//       <div style="font-family: sans-serif; max-width: 420px; margin: auto;">
//         <h2>Verify your email</h2>
//         <p>Your OTP code is:</p>
//         <h1 style="letter-spacing: 6px;">${otp}</h1>
//         <p>This code expires in 10 minutes.</p>
//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };


// export const sendResetOtpEmail = async (toEmail, otp) => {
//   const mailOptions = {
//     from: `"Tanix Draw" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: "Reset your Tanix Draw password",
//     html: `
//       <div style="font-family: sans-serif; max-width: 420px; margin: auto;">
//         <h2>Reset your password</h2>
//         <p>Your password reset OTP is:</p>
//         <h1 style="letter-spacing: 6px;">${otp}</h1>
//         <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };


import "dotenv/config";

// Render free plan pe SMTP ports block hain, isliye Brevo ki HTTPS API use ho rahi hai.
// Env variables: BREVO_API_KEY, EMAIL_USER (Brevo me verified sender email)

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const sendMail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER;

  if (!apiKey || !senderEmail) {
    throw new Error("BREVO_API_KEY or EMAIL_USER is not set");
  }

  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Tanix Draw", email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo API error ${res.status}: ${text}`);
  }
};

export const sendOtpEmail = async (toEmail, otp) => {
  await sendMail({
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
  });
};

export const sendResetOtpEmail = async (toEmail, otp) => {
  await sendMail({
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
  });
};