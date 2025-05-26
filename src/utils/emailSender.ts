import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 
console.log('SMTP_USER:', process.env.SMTP_USER); // should print your email
console.log('APP_PASS_KEY:', process.env.APP_PASS_KEY ? 'Loaded' : 'Missing');


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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
}