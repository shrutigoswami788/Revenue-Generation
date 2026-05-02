const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const Property = require('./models/Property');
    await Property.updateMany({ listingType: 'For Rent' }, { listingType: 'rent' });
    await Property.updateMany({ listingType: 'For Sale (Buy)' }, { listingType: 'buy' });
    
    const props = await Property.find();
    for (const p of props) {
        if (p.bhk.includes(' BHK')) {
            p.bhk = p.bhk.replace(' BHK', '').trim();
            await p.save();
        }
    }
    console.log('Fixed DB!');
    process.exit(0);
});
