import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
function sendMail(to, subject, text) {
  // const mailOptions={
  //     from: process.env.GMAIL_USER,
  //     to: to,
  //     subject: subject,
  //     text: text
  // }
  return transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: to,
    subject: subject,
    html: text,
  });
}

export default sendMail;
