const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const CacheService = require('../utils/cache');
const sendEmail = require('../utils/sendEmail');
const AppError = require('../utils/AppError');

exports.sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        // Rate limiting logic using cache
        const attemptsKey = `otp_attempts_${email}`;
        let attempts = await CacheService.get(attemptsKey) || 0;
        if (attempts >= 5) {
            return next(new AppError('Too many attempts. Please try again later.', 429));
        }

        const cooldownKey = `otp_cooldown_${email}`;
        const inCooldown = await CacheService.get(cooldownKey);
        if (inCooldown) {
            return next(new AppError('Please wait 60 seconds before requesting a new OTP.', 429));
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Hash OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        // Store hashed OTP in cache with 5 mins TTL
        await CacheService.set(`otp_${email}`, hashedOtp, 300);
        
        // Set cooldown and increment attempts
        await CacheService.set(cooldownKey, true, 60);
        await CacheService.set(attemptsKey, attempts + 1, 3600); // 1 hour TTL for attempts

        const message = `Here is your login OTP: \n\n${otp}\n\nThis OTP is valid for 5 minutes.`;

        await sendEmail({
            email: email,
            subject: 'Your Login OTP',
            message,
            html: `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Login OTP</h2>
                    <p>Use the OTP below to log in.</p>
                    <h1 style="color: #D4AF37; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: #888;">This OTP is valid for 5 minutes.</p>
                   </div>`
        });

        res.status(200).json({ success: true, message: "OTP sent to your email." });
    } catch (err) {
        next(err);
    }
};

exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const hashedOtp = await CacheService.get(`otp_${email}`);
        if (!hashedOtp) {
            return next(new AppError('OTP has expired or is invalid. Please request a new one.', 400));
        }

        const isMatch = await bcrypt.compare(otp.toString(), hashedOtp);
        if (!isMatch) {
            return next(new AppError('Invalid OTP entered.', 400));
        }

        // Clear OTP after successful verification
        await CacheService.del(`otp_${email}`);
        await CacheService.del(`otp_attempts_${email}`);

        res.status(200).json({ success: true, message: "OTP verified correctly" });
    } catch (err) {
        next(err);
    }
};
