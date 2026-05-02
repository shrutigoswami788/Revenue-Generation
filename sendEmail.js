const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For Gmail, use service: 'gmail', and provide user & pass (App Password)
    // For other SMTP services, provide host, port, auth.
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Admin'} <${process.env.FROM_EMAIL || process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
