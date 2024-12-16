import nodemailer from 'nodemailer';

import SETTINGS from '../../../settings';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'ruslanvak411@gmail.com',
    pass: SETTINGS.EMAIL_PASS_CODE,
  },
});

export const sendEmailAdapter = async (
  username: string,
  userEmail: string,
  confirmationCode: string,
) => {
  const mailOptions = {
    from: '"Bloggers Platform 👻" <ruslanvak411@gmail.com>',
    to: userEmail,
    subject: 'Verify your account!',
    html: `<h1>Hi ${username}! Thanks for your registration</h1><p>To finish registration please follow the link below:<a href=${SETTINGS.WEBSITE_URL}/${SETTINGS.PATH.CONFIRM_REGISTRATION}${confirmationCode}> Complete registration!</a></p>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, info: info.response };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error };
  }
};
