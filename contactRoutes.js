const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST /api/contact
// @desc    Submit a new contact inquiry
// @access  Public
router.post('/contact', async (req, res) => {
    try {
        const { clientName, contactInfo, message } = req.body;

        // Validation
        if (!clientName || !contactInfo) {
            return res.status(400).json({ success: false, error: "Name and Contact Info are required." });
        }

        // Create new contact lead
        const newContact = new Contact({
            clientName,
            contactInfo,
            message,
            date: new Date().toLocaleDateString()
        });

        // Save to database
        await newContact.save();

        res.status(201).json({ success: true, message: "Contact saved successfully." });
    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).json({ success: false, error: "Server Error: Unable to save contact." });
    }
});

// @route   GET /api/leads
// @desc    Get all contact leads for dashboard
// @access  Public (Should be protected in production)
router.get('/leads', async (req, res) => {
    try {
        // Fetch all contacts, sorted by newest first (using _id or createdAt)
        const leads = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: leads.length, data: leads });
    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({ success: false, error: "Server Error: Unable to fetch leads." });
    }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a contact lead
// @access  Public
router.delete('/leads/:id', async (req, res) => {
    try {
        const leadId = req.params.id;
        await Contact.findByIdAndDelete(leadId);
        res.status(200).json({ success: true, message: "Lead deleted successfully." });
    } catch (error) {
        console.error("Error deleting lead:", error);
        res.status(500).json({ success: false, error: "Server Error: Unable to delete lead." });
    }
});

module.exports = router;
