const nodemailer = require('nodemailer');
const dns = require('dns');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,       
  family: 4,           
  lookup: (hostname, options, callback) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (err || !addresses.length) {
        return dns.lookup(hostname, { family: 4 }, callback);
      }
      callback(null, addresses[0], 4);
    });
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error.message);
  } else {
    console.log('✅ SMTP Ready - Email notifications enabled (IPv4)');
  }
});

const sendEmailNotification = (name, email, phone, subject, service, message) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set — skipping email');
    return;
  }

  const isConsultation = !!service;

  const mailOptions = {
    from: `"Prosper Design" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: isConsultation ? '📋 New Book Consultation' : '📩 New Contact Form Message',
    html: isConsultation ? `
      <h2 style="color:#d4af37">New Consultation Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong> ${message}</p>
    ` : `
      <h2 style="color:#d4af37">New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  console.log(`📧 Sending email notification to ${process.env.EMAIL_USER}...`);

  transporter.sendMail(mailOptions, (mailError, info) => {
    if (mailError) {
      console.error('❌ Email sending failed:', mailError.message);
    } else {
      console.log('✅ Email sent successfully:', info.messageId);
    }
  });
};

module.exports = { sendEmailNotification };
