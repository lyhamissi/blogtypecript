import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.APP_PASS_KEY, 
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
