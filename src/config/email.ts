import * as nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  // @ts-ignore
  host: process.env.EMAIL_HOST as string,
  port: process.env.EMAIL_PORT as string,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
  // tls: {
  //  rejectUnauthorized: false,
  // },
});

export default transporter;