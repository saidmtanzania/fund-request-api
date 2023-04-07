/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import sgMail from '@sendgrid/mail';
import AppError from './appError';

const apiKey: any = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  throw new AppError('SENDGRID_API_KEY is not defined', 401);
}
sgMail.setApiKey(apiKey);

// if (process.env.NODE_ENV === 'production');

export const sendMail = async (option: any) => {
  const msg = {
    to: option.email, // Change to your recipient
    from: 'Mtanzania Tech <info@mtanzania.tech>', // Change to your verified sender
    subject: option.subject,
    text: option.message,
    html: option.message,
  };
  await sgMail.send(msg);
};

