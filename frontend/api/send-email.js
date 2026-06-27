import nodemailer from 'nodemailer';

/**
 * Vercel Serverless Function — /api/send-email
 *
 * Receives form data from the React frontend and sends an email via
 * Gmail SMTP (port 465 / SSL).
 *
 * Environment variables (set in Vercel Dashboard → Settings → Env Vars):
 *   EMAIL_USER  – prosperdesigns17@gmail.com
 *   EMAIL_PASS  – 16-character Gmail App Password
 *
 * These are server-side only; they are NEVER sent to the browser.
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, phone, subject, service, message } = req.body ?? {};

  if (!name || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,           // SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const isConsultation = Boolean(service);

    await transporter.sendMail({
      from: `"Prosper Design Website" <${process.env.EMAIL_USER}>`,
      to:   process.env.EMAIL_USER,
      subject: isConsultation
        ? `📋 New Consultation – ${service}`
        : (subject ? `📩 ${subject}` : '📩 New Contact Form Message'),
      html: isConsultation ? `
        <h2 style="color:#d4af37;font-family:sans-serif">New Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone || '-'}</p>
        <p><strong>Email:</strong> ${email || '-'}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <hr/>
        <p style="color:#888;font-size:12px">Sent via Prosper Design website — Vercel Email Function</p>
      ` : `
        <h2 style="color:#d4af37;font-family:sans-serif">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone || '-'}</p>
        <p><strong>Email:</strong> ${email || '-'}</p>
        <p><strong>Subject:</strong> ${subject || '-'}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <hr/>
        <p style="color:#888;font-size:12px">Sent via Prosper Design website — Vercel Email Function</p>
      `,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Vercel Email Error:', err.message);
    return res.status(500).json({ success: false, message: 'Email send failed', error: err.message });
  }
}
