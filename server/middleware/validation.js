const validateWebsiteRequest = (req, res, next) => {
    const { websiteType, userData, colorScheme } = req.body;

    const errors = [];

    // Validate website type
    const validWebsiteTypes = ['portfolio', 'business', 'blog', 'event', 'news', 'article'];
    if (!websiteType || !validWebsiteTypes.includes(websiteType)) {
        errors.push('Invalid website type');
    }

    // Validate user data
    if (!userData || typeof userData !== 'object') {
        errors.push('User data is required and must be an object');
    }

    // Validate color scheme
    if (!colorScheme || typeof colorScheme !== 'string') {
        errors.push('Color scheme is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors
        });
    }

    next();
};

module.exports = {
    validateWebsiteRequest
};
