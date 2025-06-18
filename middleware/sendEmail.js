const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'elektronikrekammedis@gmail.com', 
      pass: process.env.APP_PASSWORD    
    }
  });

  const mailOptions = {
    from: 'elektronikrekammedis@gmail.com',
    to: email,
    subject: 'OTP untuk Reset Password',
    text: `Kode OTP Anda adalah: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
