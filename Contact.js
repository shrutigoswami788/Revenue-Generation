const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Client Name is required']
    },
    contactInfo: {
        type: String,
        required: [true, 'Contact Info (Phone/Email) is required']
    },
    message: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: () => new Date().toLocaleDateString()
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
