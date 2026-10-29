import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: env.nodemailer.user,
        pass: env.nodemailer.pass
    }
});
export async function sendEmail(to, subject, html) {
    await transporter.sendMail({
        from: `"Verify your email" <${env.nodemailer.user}>`,
        to: to,
        subject: subject,
        html: html
    });
}