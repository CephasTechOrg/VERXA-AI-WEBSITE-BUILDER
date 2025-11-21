const deepseekService = require('../services/deepseekService');
const fileService = require('../services/fileService');

const generateWebsite = async (req, res, next) => {
    try {
        const { websiteType, userData, colorScheme, customizations, uploadedAssets = [] } = req.body;

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

        // Build HTML variants for preview (absolute) and packaged download (relative assets)
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const { previewHtml, packagedHtml } = await fileService.buildHtmlVariants(
            generatedCode,
            uploadedAssets,
            baseUrl
        );

        // Create downloadable files
        const downloadData = await fileService.createWebsiteFiles(packagedHtml, websiteType, uploadedAssets);

        // Send response immediately
        res.json({
            success: true,
            data: {
                html: previewHtml,
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

const downloadWebsite = async (req, res) => {
    try {
        const { id } = req.params;
        const archive = await fileService.createDownloadStream(id);

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="website-${id}.zip"`);

        archive.on('error', (err) => {
            console.error('Download error:', err);
            res.status(500).end();
        });

        archive.pipe(res);
        await archive.finalize();
    } catch (error) {
        console.error('Download failed:', error);
        res.status(404).json({
            success: false,
            error: 'Download failed',
            message: error.message
        });
    }
};

module.exports = {
    generateWebsite,
    downloadWebsite
};
