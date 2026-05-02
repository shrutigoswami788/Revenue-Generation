const { z } = require('zod');

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Please provide a valid email'),
        password: z.string().min(6, 'Password must be at least 6 characters')
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Please provide a valid email'),
        password: z.string().min(1, 'Password is required')
    })
});

const sendOtpSchema = z.object({
    body: z.object({
        email: z.string().email('Please provide a valid email')
    })
});

const verifyOtpSchema = z.object({
    body: z.object({
        email: z.string().email('Please provide a valid email'),
        otp: z.string().length(4, 'OTP must be 4 digits')
    })
});

module.exports = {
    registerSchema,
    loginSchema,
    sendOtpSchema,
    verifyOtpSchema
};
