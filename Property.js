const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true }, // E.g. "1.5 Cr", "50 L"
    loc: { type: String, required: true },
    desc: { type: String, required: true },
    tag: { type: String, default: 'New Launch' },
    bhk: { type: String, required: true }, // "1", "2", "3", "4+"
    listingType: { type: String, enum: ['buy', 'rent'], default: 'buy' },
    images: [{ type: String }], // Array of image URLs/base64
    features: {
        beds: { type: Number },
        baths: { type: Number },
        sqft: { type: Number }
    },
    priceValue: { type: Number }, // Auto-calculated numeric value for searching
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'sold'], default: 'active' },
    isRecommended: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save hook to calculate priceValue for easier filtering
PropertySchema.pre('save', function () {
    if (this.isModified('listingType')) {
        if (this.listingType === 'For Rent') this.listingType = 'rent';
        if (this.listingType === 'For Sale (Buy)') this.listingType = 'buy';
    }
    
    if (this.isModified('bhk') && this.bhk.includes(' BHK')) {
        this.bhk = this.bhk.replace(' BHK', '').trim();
    }

    if (this.isModified('price')) {
        const text = this.price.toUpperCase().replace(/,/g, '');
        const match = text.match(/[\d\.]+/);
        if (match) {
            const num = parseFloat(match[0]);
            if (text.includes('CR')) {
                this.priceValue = num * 10000000;
            } else if (text.includes('LAKH') || text.includes('L') || text.includes('LACS')) {
                this.priceValue = num * 100000;
            } else {
                this.priceValue = num; 
            }
        }
    }
});

module.exports = mongoose.model('Property', PropertySchema);
