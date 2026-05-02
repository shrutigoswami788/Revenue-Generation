const { z } = require('zod');

const propertySchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title is required'),
        price: z.string().min(1, 'Price is required'),
        loc: z.string().min(2, 'Location is required'),
        bhk: z.string().min(1, 'BHK is required'),
        listingType: z.enum(['buy', 'rent']),
        desc: z.string().optional(),
        tag: z.string().optional(),
        isRecommended: z.boolean().optional().or(z.string().transform(v => v === 'true'))
    })
});

const updatePropertySchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title is required').optional(),
        price: z.string().min(1, 'Price is required').optional(),
        loc: z.string().min(2, 'Location is required').optional(),
        bhk: z.string().min(1, 'BHK is required').optional(),
        listingType: z.enum(['buy', 'rent']).optional(),
        desc: z.string().optional(),
        tag: z.string().optional(),
        isRecommended: z.boolean().optional().or(z.string().transform(v => v === 'true')).optional(),
        status: z.enum(['active', 'sold']).optional()
    })
});

module.exports = {
    propertySchema,
    updatePropertySchema
};
