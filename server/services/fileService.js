const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class FileService {
    constructor() {
        this.generatedWebsites = new Map();
        this.cleanupInterval = setInterval(() => this.cleanupOldFiles(), 30 * 60 * 1000); // 30 minutes
    }

    async createWebsiteFiles(generatedCode, websiteType) {
        const id = uuidv4();
        const timestamp = new Date().toISOString();

        const files = {
            'index.html': generatedCode,
            'README.md': this.generateReadme(websiteType, timestamp)
        };

        this.generatedWebsites.set(id, {
            files,
            createdAt: timestamp,
            websiteType
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