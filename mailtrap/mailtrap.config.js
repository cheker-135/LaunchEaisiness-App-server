import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

if (!TOKEN || !ENDPOINT) {
  throw new Error(
    "Mailtrap credentials are missing in the environment variables"
  );
}

export const mailtrapClient = new MailtrapClient({
  endpoint: ENDPOINT,
  token: TOKEN,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Firas LH",
};
