const nodemailer = require('nodemailer');

const sendDeliveredEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    message = {
        from: options.email,
        to: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        subject: options.subject,
        html: `<p>${options.message}</p>`
    }

    await transporter.sendMail(message)
}

module.exports = sendDeliveredEmail;