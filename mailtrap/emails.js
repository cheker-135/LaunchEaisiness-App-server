import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification email: ${error}`);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password ",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending reset password email: ${error}`);
    throw new Error(`Error sending reset password email: ${error}`);
  }
};
