module.exports = {
    WEBSITE_TYPES: ['portfolio', 'business', 'blog', 'event', 'news'],
    COLOR_SCHEMES: ['modern-blue', 'professional-green', 'creative-purple', 'warm-orange', 'minimal-gray'],
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    RATE_LIMIT: {
        windowMs: 15 * 60 * 1000,
        max: 100
    }
};