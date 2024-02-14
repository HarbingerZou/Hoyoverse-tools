import nodemailer from 'nodemailer';
export default async function(title:string, message:string, email:string){
  
    let transporter = nodemailer.createTransport({
        /*host: "smtp-mail.outlook.com", // hostname
        secure: false,
        port: 587, */
        service: "Outlook365",
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS,
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
        subject: title, // subject
        text: message, // plain text body
        html: `<b>${message}</b>` // HTML body
    };
    
  
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return { message: "Email sent successfully" };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to send message to email' };
    }
  };