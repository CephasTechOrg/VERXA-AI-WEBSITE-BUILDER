import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import ColorPicker from './ColorPicker'
import './PortfolioForm.css'

const ArticleForm = () => {
    const { state, actions } = useApp()
    const [formData, setFormData] = useState({
        articleInfo: {
            title: '',
            subtitle: '',
            summary: '',
            topic: '',
            audience: '',
            tone: 'inspirational',
            keywords: '',
            publishDate: '',
            readingTime: '',
            heroImage: '',
            coverCaption: '',
            heroCTA: '',
            heroCTALink: ''
        },
        sections: [
            { heading: '', content: '', supportingImage: '', quote: '', emphasis: '' }
        ],
        highlights: [
            { title: '', detail: '' }
        ],
        author: {
            name: '',
            role: '',
            bio: '',
            headshot: '',
            social: '',
            email: ''
        },
        resources: [
            { type: '', label: '', url: '' }
        ],
        callsToAction: {
            headline: '',
            description: '',
            buttonText: '',
            buttonLink: ''
        },
        designPreferences: {
            colorAccent: '',
            layoutStyle: 'narrative',
            typography: 'serif',
            includeProgress: true,
            enableParallax: false,
            showNewsletter: true
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

        if (!formData.articleInfo.title || !formData.articleInfo.summary || !formData.sections[0].heading) {
            alert('Please provide a title, summary, and at least one section for your article.')
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
        <div className="portfolio-form article-form">
            <div className="form-header">
                <h2>Create a Long-form Article Site</h2>
                <p>Share detailed story content so the AI can craft a premium editorial experience.</p>
            </div>

            {state.loading && (
                <div className="generation-loading">
                    <div className="loading-content">
                        <div className="ai-loader">
                            <div className="ai-bubble ai-bubble-1"></div>
                            <div className="ai-bubble ai-bubble-2"></div>
                            <div className="ai-bubble ai-bubble-3"></div>
                        </div>
                        <h3>AI is crafting your narrative...</h3>
                        <p>This may take up to 2 minutes. Please keep this tab open.</p>
                        <div className="loading-progress">
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                            <div className="loading-steps">
                                <span className="step active">Structuring story</span>
                                <span className="step">Designing layout</span>
                                <span className="step">Applying visuals</span>
                                <span className="step">Finalizing build</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Article Details</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Article Title *</label>
                            <input
                                type="text"
                                value={formData.articleInfo.title}
                                onChange={(e) => handleInputChange('articleInfo', 'title', e.target.value)}
                                placeholder="The Future of Human-Centered AI"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Subtitle / Dek</label>
                            <input
                                type="text"
                                value={formData.articleInfo.subtitle}
                                onChange={(e) => handleInputChange('articleInfo', 'subtitle', e.target.value)}
                                placeholder="How design leaders can shape responsible innovation"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Article Summary *</label>
                            <textarea
                                value={formData.articleInfo.summary}
                                onChange={(e) => handleInputChange('articleInfo', 'summary', e.target.value)}
                                placeholder="Briefly summarize the core narrative readers will explore."
                                rows="3"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Topic / Theme</label>
                            <input
                                type="text"
                                value={formData.articleInfo.topic}
                                onChange={(e) => handleInputChange('articleInfo', 'topic', e.target.value)}
                                placeholder="Innovation, Sustainability, Leadership..."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Audience</label>
                            <input
                                type="text"
                                value={formData.articleInfo.audience}
                                onChange={(e) => handleInputChange('articleInfo', 'audience', e.target.value)}
                                placeholder="Product teams, researchers, CXOs..."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tone</label>
                            <select
                                value={formData.articleInfo.tone}
                                onChange={(e) => handleInputChange('articleInfo', 'tone', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="inspirational">Inspirational</option>
                                <option value="analytical">Analytical</option>
                                <option value="conversational">Conversational</option>
                                <option value="authoritative">Authoritative</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Keywords (comma separated)</label>
                            <input
                                type="text"
                                value={formData.articleInfo.keywords}
                                onChange={(e) => handleInputChange('articleInfo', 'keywords', e.target.value)}
                                placeholder="AI ethics, design ops, research"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Publish Date</label>
                            <input
                                type="date"
                                value={formData.articleInfo.publishDate}
                                onChange={(e) => handleInputChange('articleInfo', 'publishDate', e.target.value)}
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Reading Time</label>
                            <input
                                type="text"
                                value={formData.articleInfo.readingTime}
                                onChange={(e) => handleInputChange('articleInfo', 'readingTime', e.target.value)}
                                placeholder="12 min read"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero Image URL</label>
                            <input
                                type="url"
                                value={formData.articleInfo.heroImage}
                                onChange={(e) => handleInputChange('articleInfo', 'heroImage', e.target.value)}
                                placeholder="https://images.example.com/feature.jpg"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero Caption</label>
                            <input
                                type="text"
                                value={formData.articleInfo.coverCaption}
                                onChange={(e) => handleInputChange('articleInfo', 'coverCaption', e.target.value)}
                                placeholder="Photo by Aurora Studio"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero CTA Text</label>
                            <input
                                type="text"
                                value={formData.articleInfo.heroCTA}
                                onChange={(e) => handleInputChange('articleInfo', 'heroCTA', e.target.value)}
                                placeholder="Start Reading"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero CTA Link</label>
                            <input
                                type="url"
                                value={formData.articleInfo.heroCTALink}
                                onChange={(e) => handleInputChange('articleInfo', 'heroCTALink', e.target.value)}
                                placeholder="https://yourdomain.com/article"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-section">
                    <div className="section-header">
                        <h3>Article Sections</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('sections', { heading: '', content: '', supportingImage: '', quote: '', emphasis: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Section
                        </button>
                    </div>
                    {formData.sections.map((section, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Section {index + 1}</h4>
                                {formData.sections.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('sections', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Heading *</label>
                                    <input
                                        type="text"
                                        value={section.heading}
                                        onChange={(e) => handleArrayChange('sections', index, 'heading', e.target.value)}
                                        placeholder="Designing systems that learn with us"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Section Content *</label>
                                    <textarea
                                        value={section.content}
                                        onChange={(e) => handleArrayChange('sections', index, 'content', e.target.value)}
                                        rows="4"
                                        placeholder="Share detailed narrative, insights, or data..."
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Supporting Image</label>
                                    <input
                                        type="url"
                                        value={section.supportingImage}
                                        onChange={(e) => handleArrayChange('sections', index, 'supportingImage', e.target.value)}
                                        placeholder="https://images.example.com/detail.jpg"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pull Quote</label>
                                    <input
                                        type="text"
                                        value={section.quote}
                                        onChange={(e) => handleArrayChange('sections', index, 'quote', e.target.value)}
                                        placeholder="“This is where we reimagine collaboration.”"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Key Emphasis / Takeaway</label>
                                    <input
                                        type="text"
                                        value={section.emphasis}
                                        onChange={(e) => handleArrayChange('sections', index, 'emphasis', e.target.value)}
                                        placeholder="3 practical steps for design leaders"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Highlights & Insights</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('highlights', { title: '', detail: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Highlight
                        </button>
                    </div>
                    {formData.highlights.map((highlight, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Highlight {index + 1}</h4>
                                {formData.highlights.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('highlights', index)}
                                        className="btn-remove"
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
                                        value={highlight.title}
                                        onChange={(e) => handleArrayChange('highlights', index, 'title', e.target.value)}
                                        placeholder="Stat or insight title"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Detail</label>
                                    <textarea
                                        value={highlight.detail}
                                        onChange={(e) => handleArrayChange('highlights', index, 'detail', e.target.value)}
                                        rows="2"
                                        placeholder="Short supporting statement"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-section">
                    <h3>Author & Resources</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Author Name *</label>
                            <input
                                type="text"
                                value={formData.author.name}
                                onChange={(e) => handleInputChange('author', 'name', e.target.value)}
                                placeholder="Avery Bennett"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Author Role</label>
                            <input
                                type="text"
                                value={formData.author.role}
                                onChange={(e) => handleInputChange('author', 'role', e.target.value)}
                                placeholder="Principal Researcher"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Author Bio</label>
                            <textarea
                                value={formData.author.bio}
                                onChange={(e) => handleInputChange('author', 'bio', e.target.value)}
                                rows="3"
                                placeholder="Highlight credibility, experience, or previous work."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Headshot URL</label>
                            <input
                                type="url"
                                value={formData.author.headshot}
                                onChange={(e) => handleInputChange('author', 'headshot', e.target.value)}
                                placeholder="https://images.example.com/avery.jpg"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Primary Social / Portfolio</label>
                            <input
                                type="url"
                                value={formData.author.social}
                                onChange={(e) => handleInputChange('author', 'social', e.target.value)}
                                placeholder="https://linkedin.com/in/avery"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Email</label>
                            <input
                                type="email"
                                value={formData.author.email}
                                onChange={(e) => handleInputChange('author', 'email', e.target.value)}
                                placeholder="avery@studio.com"
                                disabled={state.loading}
                            />
                        </div>
                    </div>

                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>Sources & Resources</h4>
                            <button
                                type="button"
                                className="btn-add"
                                onClick={() => addArrayItem('resources', { type: '', label: '', url: '' })}
                                disabled={state.loading}
                            >
                                + Add Reference
                            </button>
                        </div>
                        {formData.resources.map((resource, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Resource {index + 1}</h5>
                                    {formData.resources.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => removeArrayItem('resources', index)}
                                            disabled={state.loading}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Type</label>
                                        <input
                                            type="text"
                                            value={resource.type}
                                            onChange={(e) => handleArrayChange('resources', index, 'type', e.target.value)}
                                            placeholder="Report, Study, Podcast..."
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Label</label>
                                        <input
                                            type="text"
                                            value={resource.label}
                                            onChange={(e) => handleArrayChange('resources', index, 'label', e.target.value)}
                                            placeholder="2024 Responsible AI Index"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>URL</label>
                                        <input
                                            type="url"
                                            value={resource.url}
                                            onChange={(e) => handleArrayChange('resources', index, 'url', e.target.value)}
                                            placeholder="https://example.com/report.pdf"
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Call to Action</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>CTA Headline</label>
                            <input
                                type="text"
                                value={formData.callsToAction.headline}
                                onChange={(e) => handleInputChange('callsToAction', 'headline', e.target.value)}
                                placeholder="Ready to explore deeper?"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>CTA Description</label>
                            <textarea
                                value={formData.callsToAction.description}
                                onChange={(e) => handleInputChange('callsToAction', 'description', e.target.value)}
                                rows="2"
                                placeholder="Invite readers to subscribe, download, or book a session."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>CTA Button Text</label>
                            <input
                                type="text"
                                value={formData.callsToAction.buttonText}
                                onChange={(e) => handleInputChange('callsToAction', 'buttonText', e.target.value)}
                                placeholder="Download the report"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>CTA Button Link</label>
                            <input
                                type="url"
                                value={formData.callsToAction.buttonLink}
                                onChange={(e) => handleInputChange('callsToAction', 'buttonLink', e.target.value)}
                                placeholder="https://yourdomain.com/cta"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Design Preferences</h3>
                    <p className="section-description">Optional cues to guide typography, layout, and interactions.</p>
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
                                <option value="narrative">Narrative scroll</option>
                                <option value="magazine">Magazine spread</option>
                                <option value="minimal">Minimal column</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Typography</label>
                            <select
                                value={formData.designPreferences.typography}
                                onChange={(e) => handleInputChange('designPreferences', 'typography', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="serif">Editorial serif</option>
                                <option value="sans-serif">Modern sans-serif</option>
                                <option value="mixed">Serif headings + sans body</option>
                            </select>
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.includeProgress}
                                onChange={(e) => handleInputChange('designPreferences', 'includeProgress', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Include reading progress bar
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.enableParallax}
                                onChange={(e) => handleInputChange('designPreferences', 'enableParallax', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Use gentle parallax on hero image
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.showNewsletter}
                                onChange={(e) => handleInputChange('designPreferences', 'showNewsletter', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Display newsletter signup in footer
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
                            �?3 This may take 1-2 minutes. Please be patient while AI builds your article experience.
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ArticleForm
