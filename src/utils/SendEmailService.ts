import nodemailer from "nodemailer";

// Define the interface for the email options
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Convert the email sender function to TypeScript
const NodeMailerEmailSender = async ({
  to,
  subject,
  html,
  text,
}: EmailOptions): Promise<nodemailer.SentMessageInfo> => {
  try {
    const TransPorter = nodemailer.createTransport({
      host: process.env.NODEMAILER_SERVICE, // if using Gmail, use "smtp.gmail.com"
      service: process.env.NODEMAILER_SERVICE,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      html,
      text,
    };

    return TransPorter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email not sent");
  }
};

// Convert the send email service function to TypeScript
export const sendEmailService = async (args: EmailOptions): Promise<void> => {
  try {
    console.log("EMAILSEND");

    await NodeMailerEmailSender(args);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Optionally rethrow the error for the caller to handle
  }
};
