const axios = require('axios');
const promptService = require('./promptService');

class DeepSeekService {
    constructor() {
        this.apiKey = process.env.DEEPSEEK_API_KEY;
        this.baseURL = 'https://api.deepseek.com/v1';
    }

    async generateWebsiteCode(websiteType, userData, colorScheme, customizations = {}) {
        try {
            const basePrompt = promptService.getBasePrompt(websiteType);
            const fullPrompt = this.constructPrompt(basePrompt, userData, colorScheme, customizations);

            console.log('🔧 Sending request to DeepSeek API...');

            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: 'deepseek-coder',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert web developer. Generate COMPLETE, production-ready HTML, CSS, and JavaScript code for websites.

IMPORTANT INSTRUCTIONS:
1. You MUST return the ENTIRE website code - do not leave any sections incomplete
2. Include ALL required sections
3. Make sure the HTML is COMPLETE with proper closing tags
4. Include ALL CSS styles
5. Include ALL JavaScript functionality
6. The code must be ready to run immediately when saved as .html
7. If you run out of tokens, prioritize completing the structure over perfect styling
8. ALWAYS include the closing </body> and </html> tags

Return the complete code without any explanations.`
                        },
                        {
                            role: 'user',
                            content: fullPrompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 8000,
                    top_p: 0.9
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 120000
                }
            );

            const generatedCode = response.data.choices[0].message.content;
            console.log('✅ Received response from DeepSeek API');

            if (!this.isCodeComplete(generatedCode)) {
                console.warn('⚠️  Generated code appears incomplete, attempting to fix...');
                return this.fixIncompleteCode(generatedCode);
            }

            return this.cleanGeneratedCode(generatedCode);

        } catch (error) {
            console.error('❌ DeepSeek API Error:', error.response?.data || error.message);
            throw new Error(`Failed to generate website: ${error.message}`);
        }
    }

    constructPrompt(basePrompt, userData, colorScheme, customizations) {
        return basePrompt
            .replace('${colorScheme}', colorScheme)
            .replace('${userData}', JSON.stringify(userData, null, 2))
            .replace('${customizations}', JSON.stringify(customizations, null, 2));
    }

    isCodeComplete(code) {
        const hasDoctype = code.includes('<!DOCTYPE html>');
        const hasHtmlOpen = code.includes('<html');
        const hasHtmlClose = code.includes('</html>');
        const hasBodyOpen = code.includes('<body');
        const hasBodyClose = code.includes('</body>');

        const trimmedCode = code.trim();
        const endsProperly = trimmedCode.endsWith('</html>') ||
            trimmedCode.endsWith('</body>') ||
            trimmedCode.endsWith('</script>');

        return hasDoctype && hasHtmlOpen && hasHtmlClose && hasBodyOpen && hasBodyClose && endsProperly;
    }

    fixIncompleteCode(incompleteCode) {
        console.log('🔧 Fixing incomplete code...');

        let fixedCode = incompleteCode.trim();

        if (!fixedCode.startsWith('<!DOCTYPE html>')) {
            fixedCode = `<!DOCTYPE html>\n${fixedCode}`;
        }

        if (!fixedCode.includes('<html')) {
            const doctypeIndex = fixedCode.indexOf('<!DOCTYPE html>');
            if (doctypeIndex !== -1) {
                fixedCode = fixedCode.substring(0, doctypeIndex + 15) + '\n<html lang="en">\n' + fixedCode.substring(doctypeIndex + 15);
            }
        }

        if (!fixedCode.includes('<head>')) {
            const htmlOpenIndex = fixedCode.indexOf('<html');
            const htmlCloseIndex = fixedCode.indexOf('>', htmlOpenIndex);
            if (htmlOpenIndex !== -1 && htmlCloseIndex !== -1) {
                fixedCode = fixedCode.substring(0, htmlCloseIndex + 1) +
                    '\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Generated Website</title>\n</head>\n<body>\n' +
                    fixedCode.substring(htmlCloseIndex + 1);
            }
        }

        if (!fixedCode.includes('</body>')) {
            fixedCode += '\n</body>';
        }

        if (!fixedCode.includes('</html>')) {
            fixedCode += '\n</html>';
        }

        fixedCode = fixedCode.replace(/style>\s*$/, 'style>\n');
        fixedCode = fixedCode.replace(/script>\s*$/, 'script>\n');

        console.log('✅ Fixed code length:', fixedCode.length, 'characters');
        return fixedCode;
    }

    cleanGeneratedCode(code) {
        let cleaned = code.replace(/```(html|css|javascript)?/g, '').trim();

        if (!cleaned.includes('<!DOCTYPE html>') && !cleaned.includes('<html')) {
            cleaned = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; }
    </style>
</head>
<body>
${cleaned}
<script>
    console.log('Website loaded successfully');
</script>
</body>
</html>`;
        }

        if (!this.isCodeComplete(cleaned)) {
            cleaned = this.createFallbackWebsite();
        }

        return cleaned;
    }

    createFallbackWebsite() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; padding: 2rem 0; }
        section { margin: 2rem 0; padding: 2rem; background: #f5f5f5; border-radius: 8px; }
        h1 { color: #333; margin-bottom: 1rem; }
        p { color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Generated Portfolio Website</h1>
            <p>This is a fallback website. The AI generation may have been incomplete.</p>
        </header>
        
        <section id="about">
            <h2>About Me</h2>
            <p>Information about the portfolio owner would appear here.</p>
        </section>
        
        <section id="skills">
            <h2>Skills</h2>
            <p>Skills and expertise would be listed here.</p>
        </section>
        
        <section id="projects">
            <h2>Projects</h2>
            <p>Portfolio projects would be displayed here.</p>
        </section>
        
        <section id="contact">
            <h2>Contact</h2>
            <p>Contact information would appear here.</p>
        </section>
    </div>
    
    <script>
        console.log('Fallback website loaded');
    </script>
</body>
</html>`;
    }
}

module.exports = new DeepSeekService();