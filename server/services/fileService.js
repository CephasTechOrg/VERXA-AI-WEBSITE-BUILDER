const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');
const { uploadDir } = require('../middleware/uploadMiddleware');

const IMAGE_KEYWORDS = ['image', 'logo', 'photo', 'avatar', 'banner', 'hero', 'thumbnail', 'cover', 'profile', 'picture'];
const MIME_EXTENSION_MAP = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/bmp': '.bmp'
};

class FileService {
    constructor() {
        this.generatedWebsites = new Map();
        this.cleanupInterval = setInterval(() => this.cleanupOldFiles(), 30 * 60 * 1000); // 30 minutes
    }

    async collectAssetsFromUserData(userData = {}, uploadedAssets = []) {
        const existingAssets = Array.isArray(uploadedAssets) ? uploadedAssets.filter(Boolean) : [];
        const discoveredUrls = this.extractImageUrls(userData);
        const existingUrls = new Set(
            existingAssets
                .map(asset => asset?.url || asset?.relativeUrl)
                .filter(Boolean)
        );

        const downloadedAssets = [];
        for (const url of discoveredUrls) {
            if (existingUrls.has(url)) continue;
            try {
                const asset = await this.downloadRemoteImage(url);
                if (asset) {
                    downloadedAssets.push(asset);
                    existingUrls.add(url);
                }
            } catch (err) {
                console.warn(`Remote asset skipped (${url}): ${err.message}`);
            }
        }

        return [...existingAssets, ...downloadedAssets];
    }

    extractImageUrls(data) {
        const urls = new Set();

        const walk = (value, pathParts = []) => {
            if (value === null || value === undefined) return;

            if (Array.isArray(value)) {
                value.forEach(item => walk(item, pathParts));
                return;
            }

            if (typeof value === 'object') {
                Object.entries(value).forEach(([key, val]) => walk(val, [...pathParts, key]));
                return;
            }

            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (!trimmed) return;
                if (!this.shouldTreatValueAsImage(pathParts, trimmed)) return;
                urls.add(trimmed);
            }
        };

        walk(data, []);
        return urls;
    }

    shouldTreatValueAsImage(pathParts, value) {
        if (!this.isHttpUrl(value)) return false;
        const hasImageKey = pathParts.some(part =>
            IMAGE_KEYWORDS.some(keyword => part.toLowerCase().includes(keyword))
        );
        const looksLikeImage = this.looksLikeImagePath(value);
        return hasImageKey || looksLikeImage;
    }

    isHttpUrl(value) {
        try {
            const parsed = new URL(value);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    }

    looksLikeImagePath(url) {
        const parsed = this.safeParseUrl(url);
        if (!parsed) return false;
        const pathname = parsed.pathname.toLowerCase();
        return Object.values(MIME_EXTENSION_MAP).some(ext => pathname.endsWith(ext));
    }

    normalizeMime(mime) {
        return mime ? mime.split(';')[0].trim().toLowerCase() : '';
    }

    guessMimeFromUrl(url) {
        const parsed = this.safeParseUrl(url);
        if (!parsed) return '';
        const ext = path.extname(parsed.pathname.split('?')[0]).toLowerCase();
        const found = Object.entries(MIME_EXTENSION_MAP).find(([, value]) => value === ext);
        return found ? found[0] : '';
    }

    getExtensionFromMimeOrUrl(mime, url) {
        const normalized = this.normalizeMime(mime);
        if (normalized && MIME_EXTENSION_MAP[normalized]) {
            return MIME_EXTENSION_MAP[normalized];
        }

        const parsed = this.safeParseUrl(url);
        if (parsed) {
            const cleanPath = parsed.pathname.split('?')[0];
            const ext = path.extname(cleanPath);
            if (ext) return ext;
        }

        return '.img';
    }

    getNameFromUrl(url) {
        const parsed = this.safeParseUrl(url);
        if (!parsed) return '';
        const cleanPath = parsed.pathname.split('?')[0];
        return path.basename(cleanPath);
    }

    safeParseUrl(value) {
        try {
            return new URL(value);
        } catch {
            return null;
        }
    }

    async downloadRemoteImage(url) {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
        const buffer = Buffer.from(response.data);
        const mime = this.normalizeMime(response.headers['content-type']) || this.guessMimeFromUrl(url);

        if (mime && !mime.startsWith('image/')) {
            throw new Error('URL is not an image type');
        }

        const extension = this.getExtensionFromMimeOrUrl(mime, url);
        const storageName = `${Date.now()}-${uuidv4()}${extension}`;
        const storagePath = path.join(uploadDir, storageName);

        await fs.writeFile(storagePath, buffer);

        const downloadName = this.getNameFromUrl(url) || storageName;

        return {
            url,
            relativeUrl: `/uploads/${storageName}`,
            filename: downloadName,
            mime: mime || 'application/octet-stream',
            size: buffer.length,
            storagePath
        };
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

        for (const asset of assets) {
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
