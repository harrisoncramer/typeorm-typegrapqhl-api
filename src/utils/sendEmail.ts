import nodemailer from "nodemailer";

export async function sendEmail(email: string, url: string) {
  // Administrative email and password for production must be passed through ENV
  // In development, we use auto-generated information
  let transporterOpts;
  if (process.env.ENV === "test") return;
  if (process.env.ENV === "production") {
    transporterOpts = {
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    };
  } else {
    const account = await nodemailer.createTestAccount();
    transporterOpts = {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass, // generated ethereal password
      },
    };
  }

  const transporter = nodemailer.createTransport(transporterOpts);

  const mailOptions = {
    from: `"TypeORM API 🔥" ${process.env.USER_EMAIL || "<fake@gmail.com>"}`, // sender address
    to: email, // list of receivers
    subject: "Forgot Password", // Subject line
    text: "You may reset your password by clicking on this link.", // plain text body
    html: `<a href="${url}">${url}</a>`, // html body
  };

  // Preview only available when sending through an Ethereal account
  const info = await transporter.sendMail(mailOptions);
  console.log(`Message sent to ${email}`);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
