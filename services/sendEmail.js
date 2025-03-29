import nodemailer from "nodemailer";
export function sendEmail(dest, message,subject) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

 
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"EconomyApp Team" ${process.env.SENDER_EMAIL} `, // sender address
      to: dest, // list of receivers
      subject:subject , 
      text: "We economy application team",
      html: message, // html body
    });    
  }

  main().catch(console.error);
}
// email ===>   economyapp240@gmail.com
//account password ==>   economy%&APP123
//app password ==> aoub khzk yglu wsra
