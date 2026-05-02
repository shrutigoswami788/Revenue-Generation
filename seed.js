const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        const uri = 'mongodb://localhost:27017/realestate';
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        const email = 'vermarobby4@gmail.com';
        const password = 'password123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        
        if (existingAdmin) {
            console.log(`Admin ${email} already exists.`);
        } else {
            const admin = new User({
                email,
                password,
                role: 'admin'
            });
            await admin.save();
            console.log(`Admin created successfully with email: ${email} and password: ${password}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
