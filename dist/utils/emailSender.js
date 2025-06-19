"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('SMTP_USER:', process.env.SMTP_USER); // should print your email
console.log('APP_PASS_KEY:', process.env.APP_PASS_KEY ? 'Loaded' : 'Missing');
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.APP_PASS_KEY,
    },
});
function sendEmail(to, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: `"Your App" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    });
}
