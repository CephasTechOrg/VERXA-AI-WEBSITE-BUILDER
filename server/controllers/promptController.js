const promptService = require('../services/promptService');

const getWebsiteTypes = (req, res) => {
    try {
        const websiteTypes = promptService.getWebsiteTypes();
        res.json({
            success: true,
            data: websiteTypes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch website types'
        });
    }
};

const getBasePrompt = (req, res) => {
    try {
        const { websiteType } = req.params;
        const basePrompt = promptService.getBasePrompt(websiteType);

        if (!basePrompt) {
            return res.status(404).json({
                success: false,
                error: 'Website type not found'
            });
        }

        res.json({
            success: true,
            data: {
                websiteType,
                basePrompt,
                description: promptService.getWebsiteTypeDescription(websiteType)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch base prompt'
        });
    }
};

module.exports = {
    getWebsiteTypes,
    getBasePrompt
};