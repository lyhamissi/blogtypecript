import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const transporter = nodemailer.createTransport({
  service: 'gmail', // Preferred over manually setting host for Gmail
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address
    pass: process.env.APP_PASS_KEY, // Your Gmail App Password
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}
