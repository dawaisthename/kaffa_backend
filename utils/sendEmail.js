const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // ✅ ADD
    port: Number(process.env.EMAIL_PORT), // ✅ ADD
    secure: process.env.EMAIL_SECURE === "true", // ✅ ADD (true for 465)
    auth: {
      user: process.env.EMAIL_USER, // should be cPanel email
      pass: process.env.EMAIL_PASS,
    },
  });

  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Kaffa Portal" <${fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments || [],
    replyTo: options.replyTo,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;
