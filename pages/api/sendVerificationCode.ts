import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function(req:NextApiRequest, res:NextApiResponse){
  console.log(req.method);
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const email  = req.body;

  console.log(email)

  const verificationCode = generateVerificationCode();

  console.log(verificationCode)


  let transporter = nodemailer.createTransport({
    /*host: "smtp-mail.outlook.com", // hostname
    secure: false,
    port: 587, */
    service: "Outlook365",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    /*
    tls: {
      ciphers:'SSLv3'
    }*/
  });
  

  let mailOptions = {
    from: '"Admin" <admin@honkaistarrail.org>', // sender address
    to: email, // receiver(s), separated by commas for multiple recipients
    subject: 'Your Verification Code for Hoyoverse.gg', // subject
    text: `Your verification code is: ${verificationCode}. Please use this code to complete your verification process.`, // plain text body for email clients that do not render HTML
    html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <h2>Hello,</h2>
            <p>Thank you for registering with Hoyoverse.gg. Please use the verification code below to complete your registration process:</p>
            <div style="background-color: #f4f4f8; text-align: center; padding: 20px; margin: 20px 0; font-size: 24px; font-weight: bold; border-radius: 5px;">
                ${verificationCode}
            </div>
            <p>If you did not request this code, please ignore this email.</p>
            <p>Best regards,<br> The Hoyoverse.gg Team</p>
        </div>
    ` // HTML body
  };

  

  // Send the email
  transporter.sendMail(mailOptions, (error) => {
    //console.log("yes yes")
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send verification code' });
    }
    // You might want to store the verification code in the session or database to validate it later

    return res.status(200).json({ message: verificationCode });
  });
};


function generateVerificationCode(){
    function generateCode(length:number) {
        let result = "";
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    
    return generateCode(6); 
    //console.log(code);
}