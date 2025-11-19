const portfolioPrompt = require('../prompts/portfolio.prompt');
const businessPrompt = require('../prompts/business.prompt');
const blogPrompt = require('../prompts/blog.prompt');
const eventPrompt = require('../prompts/event.prompt');
const newsPrompt = require('../prompts/news.prompt');
const articlePrompt = require('../prompts/article.prompt');

class PromptService {
    constructor() {
        this.websiteTypes = {
            portfolio: {
                name: 'Portfolio',
                description: 'Professional portfolio to showcase your work and skills',
                icon: '💼'
            },
            business: {
                name: 'Business',
                description: 'Corporate website for your business or startup',
                icon: '🏢'
            },
            blog: {
                name: 'Blog',
                description: 'Personal or professional blog with articles',
                icon: '📝'
            },
            event: {
                name: 'Event',
                description: 'Website for events, conferences, or weddings',
                icon: '🎉'
            },
            news: {
                name: 'News',
                description: 'News portal or magazine website',
                icon: '📰'
            },
            article: {
                name: 'Article',
                description: 'Long-form editorial or magazine feature',
                icon: 'dY"?'
            }
        };
    }

    getWebsiteTypes() {
        return Object.entries(this.websiteTypes).map(([key, value]) => ({
            id: key,
            ...value
        }));
    }

    getBasePrompt(websiteType) {
        const prompts = {
            portfolio: portfolioPrompt,
            business: businessPrompt,
            blog: blogPrompt,
            event: eventPrompt,
            news: newsPrompt,
            article: articlePrompt
        };

        return prompts[websiteType];
    }

    getWebsiteTypeDescription(websiteType) {
        return this.websiteTypes[websiteType]?.description || '';
    }
}

module.exports = new PromptService();

