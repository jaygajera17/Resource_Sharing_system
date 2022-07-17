const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //TODO: 1) Create Transporter

  const transporter = nodemailer.createTransport({
    //* For Gmail service :
    // service: 'Gmail',
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },

    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //TODO: 2) Define the email Options

  const mailOptions = {
    from: "Solanki Dakshay <dakshay@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  //TODO: 3) Actually send the email

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
