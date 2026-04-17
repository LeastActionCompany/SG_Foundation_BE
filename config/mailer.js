// config/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (subject, html) => {
  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};

module.exports = sendMail;