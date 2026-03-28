const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Use GoDaddy/Microsoft 365 or Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com", 
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Kaffa Portal" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendEmail(mailOptions);
};

module.exports = sendEmail;
