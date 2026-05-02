const Property = require('../models/Property');

// @desc    Get all properties (with pagination/search)
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit', 'minPrice', 'maxPrice', 'location', 'bhkType', '_t'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Construct query string for operators like gt, gte, lt, lte, in
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        const parsedQuery = JSON.parse(queryStr);

        // Custom search filters
        if (req.query.minPrice || req.query.maxPrice) {
            parsedQuery.priceValue = {};
            if (req.query.minPrice) parsedQuery.priceValue.$gte = parseInt(req.query.minPrice, 10);
            if (req.query.maxPrice) parsedQuery.priceValue.$lte = parseInt(req.query.maxPrice, 10);
        }

        if (req.query.location) {
            // Case-insensitive regex match for location
            parsedQuery.loc = { $regex: req.query.location, $options: 'i' };
        }

        if (req.query.bhkType) {
            // bhkType could be a comma-separated list like "1,2,3"
            const bhkArray = req.query.bhkType.split(',');
            parsedQuery.bhk = { $in: bhkArray };
        }

        query = Property.find(parsedQuery);

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // default to newest first
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Property.countDocuments(parsedQuery);

        query = query.skip(startIndex).limit(limit);

        const properties = await query;

        res.status(200).json({
            success: true,
            count: properties.length,
            pagination: {
                page,
                limit,
                total
            },
            data: properties
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.ownerId = req.user.id;

        const property = await Property.create(req.body);

        res.status(201).json({
            success: true,
            data: property
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res, next) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Make sure user is property owner or admin
        if (property.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'User not authorized to update this property' });
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Make sure user is property owner or admin
        if (property.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'User not authorized to delete this property' });
        }

        await property.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
