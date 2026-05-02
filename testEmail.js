require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const sendEmail = require('./utils/sendEmail');

const testMail = async () => {
    try {
        if (process.env.EMAIL_PASSWORD === 'ENTER_YOUR_APP_PASSWORD_HERE') {
            console.log("❌ ERROR: You still have 'ENTER_YOUR_APP_PASSWORD_HERE' in your .env file!");
            console.log("Please generate an App Password from your Google Account and put it in the .env file.");
            process.exit(1);
        }
        
        await sendEmail({
            email: process.env.EMAIL_USERNAME,
            subject: 'Test Email',
            message: 'This is a test email to verify your SMTP configuration.',
            html: '<h1>Test Email</h1><p>Your email setup is working perfectly!</p>'
        });
        console.log("✅ SUCCESS: Test email sent successfully!");
    } catch (error) {
        console.log("❌ ERROR: Failed to send test email.");
        console.error(error);
    }
};

testMail();
