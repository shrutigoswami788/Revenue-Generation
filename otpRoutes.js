const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const validate = require('../middleware/validate');
const { sendOtpSchema, verifyOtpSchema } = require('../validations/auth.validation');

const router = express.Router();

router.post('/send-otp', validate(sendOtpSchema), sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);

module.exports = router;
