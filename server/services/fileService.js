const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');

const uploadsRoot = path.join(__dirname, '..', 'uploads');

class FileService {
    constructor() {
        this.generatedWebsites = new Map();
        this.cleanupInterval = setInterval(() => this.cleanupOldFiles(), 30 * 60 * 1000); // 30 minutes
    }

    async buildHtmlVariants(html, assets = [], baseUrl = '') {
        const addBaseTag = (code, href) => {
            if (!href) return code;
            // insert base tag right after <head ...>
            const baseTag = `<base href="${href.replace(/\/$/, '')}/">`;
            const headIndex = code.toLowerCase().indexOf('<head');
            if (headIndex === -1) return code;
            const headClose = code.indexOf('>', headIndex);
            if (headClose === -1) return code;
            return `${code.slice(0, headClose + 1)}\n    ${baseTag}\n${code.slice(headClose + 1)}`;
        };

        const replaceAll = (code, from, to) => {
            if (!from) return code;
            return code.split(from).join(to);
        };

        let previewHtml = html;
        let packagedHtml = html;

        // Ensure any direct /uploads references are included even if the client missed registering them
        const foundUploadFiles = new Set();
        const uploadRegex = /(?:https?:\/\/[^\\s"']+)?\\/uploads\\/([^"')\\s]+)/g;
        let match;
        while ((match = uploadRegex.exec(html)) !== null) {
            foundUploadFiles.add(match[1]);
        }

        const supplementalAssets = [];
        for (const fname of foundUploadFiles) {
            try {
                const storagePath = path.join(uploadsRoot, fname);
                await fs.access(storagePath);
                supplementalAssets.push({
                    storagePath,
                    filename: fname,
                    mime: '',
                    relativeUrl: `/uploads/${fname}`,
                    url: `${baseUrl}/uploads/${fname}`
                });
            } catch (_) {
                // ignore missing
            }
        }

        const allAssets = [...assets, ...supplementalAssets];

        for (const asset of allAssets) {
            const safeName = asset.filename || path.basename(asset.storagePath || '');
            const packagedPath = `assets/${safeName}`;
            const assetUrls = [asset.url, asset.relativeUrl, asset.storagePath].filter(Boolean);

            // Inline uploads for preview so iframe always loads them
            let dataUrl;
            if (asset.storagePath && asset.mime) {
                try {
                    const buffer = await fs.readFile(asset.storagePath);
                    const base64 = buffer.toString('base64');
                    dataUrl = `data:${asset.mime};base64,${base64}`;
                } catch (err) {
                    console.error('Failed to inline asset for preview:', err.message);
                }
            }

            assetUrls.forEach(match => {
                packagedHtml = replaceAll(packagedHtml, match, packagedPath);
                if (dataUrl) {
                    previewHtml = replaceAll(previewHtml, match, dataUrl);
                } else if (asset.url) {
                    previewHtml = replaceAll(previewHtml, match, asset.url);
                }
            });
        }

        // Help any remaining relative paths resolve in preview
        previewHtml = addBaseTag(previewHtml, baseUrl);

        return { previewHtml, packagedHtml };
    }

    async createWebsiteFiles(generatedCode, websiteType, uploadedAssets = []) {
        const id = uuidv4();
        const timestamp = new Date().toISOString();

        const files = {
            'index.html': generatedCode,
            'README.md': this.generateReadme(websiteType, timestamp)
        };

        const normalizedAssets = Array.isArray(uploadedAssets)
            ? uploadedAssets
                .filter(asset => asset && asset.storagePath && (asset.filename || asset.originalName))
                .map(asset => ({
                    storagePath: asset.storagePath,
                    filename: asset.filename || asset.originalName,
                    mime: asset.mime,
                    size: asset.size,
                    url: asset.url || asset.relativeUrl
                }))
            : [];

        this.generatedWebsites.set(id, {
            files,
            createdAt: timestamp,
            websiteType,
            assets: normalizedAssets
        });

        return {
            id,
            files: Object.keys(files),
            downloadUrl: `/api/website/download/${id}`
        };
    }

    generateReadme(websiteType, timestamp) {
        return `# Generated ${websiteType.charAt(0).toUpperCase() + websiteType.slice(1)} Website

This website was generated using AI Website Generator.

- Generated on: ${timestamp}
- Website Type: ${websiteType}
- Technology: Pure HTML, CSS, JavaScript

## How to Use
1. Open index.html in your web browser
2. Deploy to any static hosting service

## Customization
You can customize this website by editing the HTML, CSS, and JavaScript files.
`;
    }

    async getWebsiteFiles(id) {
        const website = this.generatedWebsites.get(id);
        if (!website) {
            throw new Error('Website not found or expired');
        }
        return website.files;
    }

    async createDownloadStream(id) {
        const website = this.generatedWebsites.get(id);
        if (!website) {
            throw new Error('Website not found or expired');
        }

        const archive = archiver('zip', { zlib: { level: 9 } });

        // Append generated files
        for (const [filename, content] of Object.entries(website.files)) {
            archive.append(content, { name: filename });
        }

        // Append uploaded assets if they still exist
        const assets = website.assets || [];
        for (const asset of assets) {
            if (!asset.storagePath || !asset.filename) continue;
            const safeName = path.basename(asset.filename);
            try {
                await fs.access(asset.storagePath);
                archive.file(asset.storagePath, { name: `assets/${safeName}` });
            } catch {
                // Skip missing assets
                continue;
            }
        }

        return archive;
    }

    cleanupOldFiles() {
        const now = new Date();
        for (const [id, website] of this.generatedWebsites.entries()) {
            const age = now - new Date(website.createdAt);
            if (age > 60 * 60 * 1000) { // 1 hour
                this.generatedWebsites.delete(id);
            }
        }
    }
}

module.exports = new FileService();
