const deepseekService = require('../services/deepseekService');
const fileService = require('../services/fileService');

const generateWebsite = async (req, res, next) => {
    try {
        const { websiteType, userData, colorScheme, customizations } = req.body;

        console.log(`🔧 Generating ${websiteType} website...`);
        console.log(`📊 User data size: ${JSON.stringify(userData).length} characters`);

        // Generate website code using DeepSeek
        const generatedCode = await deepseekService.generateWebsiteCode(
            websiteType,
            userData,
            colorScheme,
            customizations
        );

        console.log(`✅ Generation successful`);
        console.log(`📄 Final code length: ${generatedCode.length} characters`);

        // Create downloadable files
        const downloadData = await fileService.createWebsiteFiles(generatedCode, websiteType);

        // Send response immediately
        res.json({
            success: true,
            data: {
                html: generatedCode,
                downloadUrl: `/api/website/download/${downloadData.id}`,
                files: downloadData.files,
                metadata: {
                    websiteType,
                    generatedAt: new Date().toISOString(),
                    colorScheme,
                    codeLength: generatedCode.length
                }
            },
            message: 'Website generated successfully!'
        });

    } catch (error) {
        console.error('❌ Website generation error:', error);

        // Send proper error response
        res.status(500).json({
            success: false,
            error: 'Website generation failed',
            message: error.message
        });
    }
};

module.exports = {
    generateWebsite
};