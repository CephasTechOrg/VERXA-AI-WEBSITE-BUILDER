import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import ColorPicker from './ColorPicker'
import './PortfolioForm.css'

const NewsForm = () => {
    const { state, actions } = useApp()
    const [formData, setFormData] = useState({
        newsInfo: {
            name: '',
            tagline: '',
            description: '',
            location: '',
            editorialFocus: '',
            foundedYear: '',
            contactEmail: '',
            hotline: '',
            heroCTA: '',
            heroCTALink: '',
            logo: '',
            heroImage: ''
        },
        featuredStory: {
            headline: '',
            summary: '',
            category: '',
            author: '',
            location: '',
            publishDate: '',
            image: '',
            link: ''
        },
        breakingNews: [
            { title: '', timestamp: '', link: '' }
        ],
        articles: [
            { headline: '', summary: '', category: '', tags: '', author: '', publishDate: '', readTime: '', image: '', link: '' }
        ],
        reporters: [
            { name: '', beat: '', bio: '', photo: '', contact: '' }
        ],
        categories: [
            { name: '', description: '' }
        ],
        trendingStories: [
            { title: '', snippet: '', link: '' }
        ],
        newsletter: {
            headline: 'Stay informed',
            description: '',
            placeholder: 'Email address',
            ctaText: 'Subscribe now'
        },
        socialLinks: {
            twitter: '',
            facebook: '',
            instagram: '',
            youtube: '',
            telegram: '',
            rss: ''
        },
        designPreferences: {
            colorAccent: '',
            layoutStyle: 'newspaper',
            typography: 'serif',
            cardStyle: 'bordered',
            showTicker: true,
            showCategoryNav: true,
            highlightBreakingBadge: true
        }
    })

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const handleArrayChange = (path, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [path]: prev[path].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const addArrayItem = (path, template) => {
        setFormData(prev => ({
            ...prev,
            [path]: [...prev[path], { ...template }]
        }))
    }

    const removeArrayItem = (path, index) => {
        setFormData(prev => ({
            ...prev,
            [path]: prev[path].filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.newsInfo.name || !formData.newsInfo.description || !formData.featuredStory.headline) {
            alert('Please provide your newsroom name, description, and a featured headline before generating.')
            return
        }

        actions.generateWebsiteStart()

        try {
            const result = await actions.generateWebsite(
                state.websiteType.id,
                formData,
                state.colorScheme
            )
            actions.generateWebsiteSuccess(result)
        } catch (error) {
            actions.generateWebsiteError(error.message)
            if (error.message.includes('timeout')) {
                alert('Generation took too long. Please try again shortly.')
            } else {
                alert(`Generation failed: ${error.message}`)
            }
        }
    }

    return (
        <div className="portfolio-form news-form">
            <div className="form-header">
                <h2>Build Your Newsroom Site</h2>
                <p>Provide your publication details so the AI can craft a polished news destination.</p>
            </div>

            {state.loading && (
                <div className="generation-loading">
                    <div className="loading-content">
                        <div className="ai-loader">
                            <div className="ai-bubble ai-bubble-1"></div>
                            <div className="ai-bubble ai-bubble-2"></div>
                            <div className="ai-bubble ai-bubble-3"></div>
                        </div>
                        <h3>AI is building your newsroom...</h3>
                        <p>This may take up to 2 minutes. Please keep this tab open.</p>
                        <div className="loading-progress">
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                            <div className="loading-steps">
                                <span className="step active">Collecting stories</span>
                                <span className="step">Designing layout</span>
                                <span className="step">Branding site</span>
                                <span className="step">Finalizing build</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Newsroom Identity</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Publication Name *</label>
                            <input
                                type="text"
                                value={formData.newsInfo.name}
                                onChange={(e) => handleInputChange('newsInfo', 'name', e.target.value)}
                                placeholder="Daily Pulse Network"
                                disabled={state.loading}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tagline</label>
                            <input
                                type="text"
                                value={formData.newsInfo.tagline}
                                onChange={(e) => handleInputChange('newsInfo', 'tagline', e.target.value)}
                                placeholder="Breaking stories that matter"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Newsroom Description *</label>
                            <textarea
                                value={formData.newsInfo.description}
                                onChange={(e) => handleInputChange('newsInfo', 'description', e.target.value)}
                                placeholder="Share your editorial mission, coverage areas, and audience."
                                rows="3"
                                disabled={state.loading}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Primary Location</label>
                            <input
                                type="text"
                                value={formData.newsInfo.location}
                                onChange={(e) => handleInputChange('newsInfo', 'location', e.target.value)}
                                placeholder="New York, NY"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Editorial Focus</label>
                            <input
                                type="text"
                                value={formData.newsInfo.editorialFocus}
                                onChange={(e) => handleInputChange('newsInfo', 'editorialFocus', e.target.value)}
                                placeholder="Business, tech, civic news"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Founded Year</label>
                            <input
                                type="text"
                                value={formData.newsInfo.foundedYear}
                                onChange={(e) => handleInputChange('newsInfo', 'foundedYear', e.target.value)}
                                placeholder="2012"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Email</label>
                            <input
                                type="email"
                                value={formData.newsInfo.contactEmail}
                                onChange={(e) => handleInputChange('newsInfo', 'contactEmail', e.target.value)}
                                placeholder="editor@dailypulse.com"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Newsroom Hotline</label>
                            <input
                                type="text"
                                value={formData.newsInfo.hotline}
                                onChange={(e) => handleInputChange('newsInfo', 'hotline', e.target.value)}
                                placeholder="+1 (555) 010-2020"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero CTA Text</label>
                            <input
                                type="text"
                                value={formData.newsInfo.heroCTA}
                                onChange={(e) => handleInputChange('newsInfo', 'heroCTA', e.target.value)}
                                placeholder="Read the latest"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero CTA Link</label>
                            <input
                                type="url"
                                value={formData.newsInfo.heroCTALink}
                                onChange={(e) => handleInputChange('newsInfo', 'heroCTALink', e.target.value)}
                                placeholder="https://newsroom.com/latest"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Logo URL</label>
                            <input
                                type="url"
                                value={formData.newsInfo.logo}
                                onChange={(e) => handleInputChange('newsInfo', 'logo', e.target.value)}
                                placeholder="https://cdn.site.com/logo.svg"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero Image</label>
                            <input
                                type="url"
                                value={formData.newsInfo.heroImage}
                                onChange={(e) => handleInputChange('newsInfo', 'heroImage', e.target.value)}
                                placeholder="https://images.site.com/newsroom.jpg"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Featured Story</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Headline *</label>
                            <input
                                type="text"
                                value={formData.featuredStory.headline}
                                onChange={(e) => handleInputChange('featuredStory', 'headline', e.target.value)}
                                placeholder="City unveils 2030 climate roadmap"
                                disabled={state.loading}
                                required
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Summary *</label>
                            <textarea
                                value={formData.featuredStory.summary}
                                onChange={(e) => handleInputChange('featuredStory', 'summary', e.target.value)}
                                placeholder="Write a concise preview for the hero section."
                                rows="3"
                                disabled={state.loading}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                value={formData.featuredStory.category}
                                onChange={(e) => handleInputChange('featuredStory', 'category', e.target.value)}
                                placeholder="Politics"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Reporter</label>
                            <input
                                type="text"
                                value={formData.featuredStory.author}
                                onChange={(e) => handleInputChange('featuredStory', 'author', e.target.value)}
                                placeholder="By Lina Ortiz"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Dateline / Location</label>
                            <input
                                type="text"
                                value={formData.featuredStory.location}
                                onChange={(e) => handleInputChange('featuredStory', 'location', e.target.value)}
                                placeholder="Washington, D.C."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Publish Date</label>
                            <input
                                type="date"
                                value={formData.featuredStory.publishDate}
                                onChange={(e) => handleInputChange('featuredStory', 'publishDate', e.target.value)}
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero Image</label>
                            <input
                                type="url"
                                value={formData.featuredStory.image}
                                onChange={(e) => handleInputChange('featuredStory', 'image', e.target.value)}
                                placeholder="https://images.site.com/feature.jpg"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Article Link</label>
                            <input
                                type="url"
                                value={formData.featuredStory.link}
                                onChange={(e) => handleInputChange('featuredStory', 'link', e.target.value)}
                                placeholder="https://newsroom.com/articles/2030-roadmap"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Breaking News Ticker</h3>
                        <button
                            type="button"
                            className="btn-add"
                            onClick={() => addArrayItem('breakingNews', { title: '', timestamp: '', link: '' })}
                            disabled={state.loading}
                        >
                            + Add Breaking Item
                        </button>
                    </div>
                    {formData.breakingNews.map((item, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Breaking Story {index + 1}</h4>
                                {formData.breakingNews.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => removeArrayItem('breakingNews', index)}
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleArrayChange('breakingNews', index, 'title', e.target.value)}
                                        placeholder="Mayor declares state of emergency"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Timestamp</label>
                                    <input
                                        type="text"
                                        value={item.timestamp}
                                        onChange={(e) => handleArrayChange('breakingNews', index, 'timestamp', e.target.value)}
                                        placeholder="9:32 AM ET"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Link</label>
                                    <input
                                        type="url"
                                        value={item.link}
                                        onChange={(e) => handleArrayChange('breakingNews', index, 'link', e.target.value)}
                                        placeholder="https://newsroom.com/breaking/mayor"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Latest Articles</h3>
                        <button
                            type="button"
                            className="btn-add"
                            onClick={() => addArrayItem('articles', { headline: '', summary: '', category: '', tags: '', author: '', publishDate: '', readTime: '', image: '', link: '' })}
                            disabled={state.loading}
                        >
                            + Add Article
                        </button>
                    </div>
                    {formData.articles.map((article, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Article {index + 1}</h4>
                                {formData.articles.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => removeArrayItem('articles', index)}
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Headline</label>
                                    <input
                                        type="text"
                                        value={article.headline}
                                        onChange={(e) => handleArrayChange('articles', index, 'headline', e.target.value)}
                                        placeholder="Transit upgrade breaks ground"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        value={article.category}
                                        onChange={(e) => handleArrayChange('articles', index, 'category', e.target.value)}
                                        placeholder="Infrastructure"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tags</label>
                                    <input
                                        type="text"
                                        value={article.tags}
                                        onChange={(e) => handleArrayChange('articles', index, 'tags', e.target.value)}
                                        placeholder="transportation, policy"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Reporter</label>
                                    <input
                                        type="text"
                                        value={article.author}
                                        onChange={(e) => handleArrayChange('articles', index, 'author', e.target.value)}
                                        placeholder="By Alex Chen"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Publish Date</label>
                                    <input
                                        type="date"
                                        value={article.publishDate}
                                        onChange={(e) => handleArrayChange('articles', index, 'publishDate', e.target.value)}
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Read Time</label>
                                    <input
                                        type="text"
                                        value={article.readTime}
                                        onChange={(e) => handleArrayChange('articles', index, 'readTime', e.target.value)}
                                        placeholder="5 min read"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Feature Image</label>
                                    <input
                                        type="url"
                                        value={article.image}
                                        onChange={(e) => handleArrayChange('articles', index, 'image', e.target.value)}
                                        placeholder="https://images.site.com/transit.jpg"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Summary</label>
                                    <textarea
                                        value={article.summary}
                                        onChange={(e) => handleArrayChange('articles', index, 'summary', e.target.value)}
                                        rows="2"
                                        placeholder="Two sentence synopsis"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Article Link</label>
                                    <input
                                        type="url"
                                        value={article.link}
                                        onChange={(e) => handleArrayChange('articles', index, 'link', e.target.value)}
                                        placeholder="https://newsroom.com/articles/transit-upgrade"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-section">
                    <div className="section-header">
                        <h3>Reporter Profiles</h3>
                        <button
                            type="button"
                            className="btn-add"
                            onClick={() => addArrayItem('reporters', { name: '', beat: '', bio: '', photo: '', contact: '' })}
                            disabled={state.loading}
                        >
                            + Add Reporter
                        </button>
                    </div>
                    {formData.reporters.map((reporter, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Reporter {index + 1}</h4>
                                {formData.reporters.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => removeArrayItem('reporters', index)}
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={reporter.name}
                                        onChange={(e) => handleArrayChange('reporters', index, 'name', e.target.value)}
                                        placeholder="Taylor Brooks"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Beat</label>
                                    <input
                                        type="text"
                                        value={reporter.beat}
                                        onChange={(e) => handleArrayChange('reporters', index, 'beat', e.target.value)}
                                        placeholder="Climate & Energy"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact / Social</label>
                                    <input
                                        type="text"
                                        value={reporter.contact}
                                        onChange={(e) => handleArrayChange('reporters', index, 'contact', e.target.value)}
                                        placeholder="@taylorreports"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Photo URL</label>
                                    <input
                                        type="url"
                                        value={reporter.photo}
                                        onChange={(e) => handleArrayChange('reporters', index, 'photo', e.target.value)}
                                        placeholder="https://images.site.com/taylor.jpg"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Short Bio</label>
                                    <textarea
                                        value={reporter.bio}
                                        onChange={(e) => handleArrayChange('reporters', index, 'bio', e.target.value)}
                                        rows="2"
                                        placeholder="Describe experience, awards, expertise"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <h3>Sidebar Content</h3>
                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>Categories</h4>
                            <button
                                type="button"
                                className="btn-add"
                                onClick={() => addArrayItem('categories', { name: '', description: '' })}
                                disabled={state.loading}
                            >
                                + Add Category
                            </button>
                        </div>
                        {formData.categories.map((category, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Category {index + 1}</h5>
                                    {formData.categories.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => removeArrayItem('categories', index)}
                                            disabled={state.loading}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={category.name}
                                            onChange={(e) => handleArrayChange('categories', index, 'name', e.target.value)}
                                            placeholder="Global Affairs"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description</label>
                                        <textarea
                                            value={category.description}
                                            onChange={(e) => handleArrayChange('categories', index, 'description', e.target.value)}
                                            rows="2"
                                            placeholder="What stories appear here?"
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>Trending Stories</h4>
                            <button
                                type="button"
                                className="btn-add"
                                onClick={() => addArrayItem('trendingStories', { title: '', snippet: '', link: '' })}
                                disabled={state.loading}
                            >
                                + Add Trending Story
                            </button>
                        </div>
                        {formData.trendingStories.map((story, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Story {index + 1}</h5>
                                    {formData.trendingStories.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => removeArrayItem('trendingStories', index)}
                                            disabled={state.loading}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            value={story.title}
                                            onChange={(e) => handleArrayChange('trendingStories', index, 'title', e.target.value)}
                                            placeholder="Markets rally after rate pause"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Snippet</label>
                                        <textarea
                                            value={story.snippet}
                                            onChange={(e) => handleArrayChange('trendingStories', index, 'snippet', e.target.value)}
                                            rows="2"
                                            placeholder="One-sentence teaser"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Link</label>
                                        <input
                                            type="url"
                                            value={story.link}
                                            onChange={(e) => handleArrayChange('trendingStories', index, 'link', e.target.value)}
                                            placeholder="https://newsroom.com/business/markets-rally"
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-section">
                    <h3>Newsletter & Social</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Newsletter Headline</label>
                            <input
                                type="text"
                                value={formData.newsletter.headline}
                                onChange={(e) => handleInputChange('newsletter', 'headline', e.target.value)}
                                placeholder="Newsletter name"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Newsletter Description</label>
                            <textarea
                                value={formData.newsletter.description}
                                onChange={(e) => handleInputChange('newsletter', 'description', e.target.value)}
                                rows="2"
                                placeholder="Tell readers what they receive."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Input Placeholder</label>
                            <input
                                type="text"
                                value={formData.newsletter.placeholder}
                                onChange={(e) => handleInputChange('newsletter', 'placeholder', e.target.value)}
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>CTA Text</label>
                            <input
                                type="text"
                                value={formData.newsletter.ctaText}
                                onChange={(e) => handleInputChange('newsletter', 'ctaText', e.target.value)}
                                disabled={state.loading}
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Twitter / X</label>
                            <input
                                type="url"
                                value={formData.socialLinks.twitter}
                                onChange={(e) => handleInputChange('socialLinks', 'twitter', e.target.value)}
                                placeholder="https://x.com/yournewsroom"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Facebook</label>
                            <input
                                type="url"
                                value={formData.socialLinks.facebook}
                                onChange={(e) => handleInputChange('socialLinks', 'facebook', e.target.value)}
                                placeholder="https://facebook.com/yournewsroom"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Instagram</label>
                            <input
                                type="url"
                                value={formData.socialLinks.instagram}
                                onChange={(e) => handleInputChange('socialLinks', 'instagram', e.target.value)}
                                placeholder="https://instagram.com/yournewsroom"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>YouTube</label>
                            <input
                                type="url"
                                value={formData.socialLinks.youtube}
                                onChange={(e) => handleInputChange('socialLinks', 'youtube', e.target.value)}
                                placeholder="https://youtube.com/@yournewsroom"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Telegram</label>
                            <input
                                type="url"
                                value={formData.socialLinks.telegram}
                                onChange={(e) => handleInputChange('socialLinks', 'telegram', e.target.value)}
                                placeholder="https://t.me/yournewsroom"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>RSS Feed</label>
                            <input
                                type="url"
                                value={formData.socialLinks.rss}
                                onChange={(e) => handleInputChange('socialLinks', 'rss', e.target.value)}
                                placeholder="https://newsroom.com/rss.xml"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Design Preferences</h3>
                    <p className="section-description">Optional styling cues to help the AI match your newsroom brand.</p>
                    <div className="form-grid">
                        <div className="form-group">
                            <ColorPicker
                                label="Accent Color"
                                value={formData.designPreferences.colorAccent}
                                onChange={(color) => handleInputChange('designPreferences', 'colorAccent', color)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Layout Style</label>
                            <select
                                value={formData.designPreferences.layoutStyle}
                                onChange={(e) => handleInputChange('designPreferences', 'layoutStyle', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="newspaper">Newspaper Grid</option>
                                <option value="modern">Modern Cards</option>
                                <option value="magazine">Magazine Spread</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Typography</label>
                            <select
                                value={formData.designPreferences.typography}
                                onChange={(e) => handleInputChange('designPreferences', 'typography', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="serif">Classic serif</option>
                                <option value="sans-serif">Clean sans-serif</option>
                                <option value="mixed">Mixed serif & sans</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Card Style</label>
                            <select
                                value={formData.designPreferences.cardStyle}
                                onChange={(e) => handleInputChange('designPreferences', 'cardStyle', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="bordered">Bordered</option>
                                <option value="elevated">Shadow / elevated</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.showTicker}
                                onChange={(e) => handleInputChange('designPreferences', 'showTicker', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Show breaking news ticker
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.showCategoryNav}
                                onChange={(e) => handleInputChange('designPreferences', 'showCategoryNav', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Display category navigation pills
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.highlightBreakingBadge}
                                onChange={(e) => handleInputChange('designPreferences', 'highlightBreakingBadge', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Highlight breaking badge styling
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary btn-large"
                        disabled={state.loading}
                    >
                        {state.loading ? (
                            <>
                                <div className="button-spinner"></div>
                                Generating Website...
                            </>
                        ) : (
                            'Generate Website'
                        )}
                    </button>

                    {state.loading && (
                        <p className="generation-note">
                            Please keep this window open while your news site is being generated.
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default NewsForm
