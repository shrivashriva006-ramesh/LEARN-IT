const nodemailer = require('nodemailer');

const isSmtpConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.EMAIL_FROM
  );

const sendVerificationEmail = async (email, name, token) => {
  if (!isSmtpConfigured()) {
    throw new Error('SMTP email settings are incomplete');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const verificationUrl = new URL('/verify-email', process.env.CLIENT_URL || 'http://localhost:5173');
  verificationUrl.searchParams.set('token', token);
  const safeName = name.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your Ed Tech Portal email',
    text: `Hello ${name}, verify your email address using this link: ${verificationUrl.toString()}`,
    html: `<p>Hello ${safeName},</p><p><a href="${verificationUrl.toString()}">Verify your email address</a></p><p>This link expires in 24 hours.</p>`,
  });
};

module.exports = { isSmtpConfigured, sendVerificationEmail };
