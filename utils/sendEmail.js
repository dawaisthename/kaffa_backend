const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
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
    replyTo: options.replyTo, // <--- ADD THIS LINE
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;
