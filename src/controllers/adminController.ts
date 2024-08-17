import Admin from "../models/Admin.model"
import { Request, Response } from "express"
import dotenv from "dotenv";
dotenv.config()
import nodemailer from "nodemailer"

const inviteAdmin = async (req: Request, res: Response) => {
    const { email } = req.body
    try{

        const refCode = "8L9R-MK4T-5X7N-HU9K-GOLDIES-ADMIN"
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
              },
              tls: {
                rejectUnauthorized: false,
              },
            });

        const SignUpURL = `https://goldies-frontend.vercel.app/invite_admin?refCode=${refCode}`;

    const emailContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #007bff;">Password Reset Request</h2>
      <p>Goldies has invited you to be part of the administration team.</p>
      <a 
        href="${SignUpURL}" 
        style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

      const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Goldies Admin Invitation",
      text: "Goldies has invited you to be part of the administration team.",
      html: emailContent,
    };
        const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return res.status(200).json({
      error: false,
      message: "Message sent",
      info: info.messageId,
    });
    } catch(error){
        return res.status(500).json({
            error: true,
            err: error,
            message: "Internal server error"
        })
    }

}

export { inviteAdmin }