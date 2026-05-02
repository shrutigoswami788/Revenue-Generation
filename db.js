const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Fallback to local MongoDB if MONGO_URI is not set
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';
        await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
