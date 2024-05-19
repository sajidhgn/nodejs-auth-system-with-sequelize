const nodemailer = require("nodemailer");

async function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}
async function sendEmail(email, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.AUTH_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
      },
    });

    const mailOptions = {
      from: '"Infinite Crypto Yield ⚡︎⚡︎⚡︎" <contact@infinitecryptoyield.com>',
      to: email,
      subject:
        subject ||
        "Infinite Crypto Yield - Your Gateway to Endless Possibilities ✔",
      text: message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
        return { msg: info.response };
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
}

module.exports = {
  createTransporter,
  sendEmail,
};
