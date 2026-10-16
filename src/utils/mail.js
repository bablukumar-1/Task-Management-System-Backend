
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";

dotenv.config();

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Task Manager",
    link: "https://taskmanager.app",
  },
});

const sendMail = async (options) => {
  const emailText = mailGenerator.generatePlaintext(
    options.mailGenContent
  );

  const emailHtml = mailGenerator.generate(
    options.mailGenContent
  );

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: Number(process.env.MAILTRAP_SMTP_PORT) === 465,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: process.env.SENDER_EMAIL,
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    return await transporter.sendMail(mail);
  } catch (error) {
    console.error("Error while sending email:", error.message);
    throw error;
  }
};


const emailVerificationMailGenContent = (
  username,
  verificationURL
) => ({
  body: {
    name: username,
    intro: "Welcome! We're excited to have you on board.",

    action: {
      instructions: "To get started, please verify your email.",
      button: {
        color: "#22BC66",
        text: "Verify Your Email",
        link: verificationURL,
      },
    },

    outro: [
      "If the button does not work, copy and paste this link into your browser:",
      verificationURL,
      "Need help? Just reply to this email.",
    ],
  },
});


const forgotPasswordMailgenContent = (
  username,
  passwordResetUrl
) => ({
  body: {
    name: username,
    intro: "We received a request to reset your password.",

    action: {
      instructions: "Click the button below to reset your password.",
      button: {
        color: "#22BC66",
        text: "Reset Password",
        link: passwordResetUrl,
      },
    },

    outro: [
      "If the button above does not work, copy and paste the following link into your browser:",
      passwordResetUrl,
      "If you did not request a password reset, please ignore this email.",
    ],
  },
});


export {
  emailVerificationMailGenContent,
  sendMail,
  forgotPasswordMailgenContent,
};
