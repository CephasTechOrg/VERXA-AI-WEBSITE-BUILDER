import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import ColorPicker from './ColorPicker'
import ImageUploadInput from './ImageUploadInput'
import './PortfolioForm.css'

const BlogForm = () => {
    const { state, actions } = useApp()
    const [formData, setFormData] = useState({
        blogInfo: {
            name: '',
            tagline: '',
            description: '',
            targetAudience: '',
            voice: 'friendly',
            location: '',
            publishFrequency: '',
            heroCTA: '',
            heroCTALink: '',
            logo: '',
            heroImage: ''
        },
        featuredPost: {
            title: '',
            excerpt: '',
            category: '',
            publishDate: '',
            readTime: '',
            image: '',
            link: ''
        },
        posts: [
            { title: '', excerpt: '', category: '', tags: '', publishDate: '', readTime: '', image: '', link: '', isPinned: false }
        ],
        authors: [
            { name: '', bio: '', expertise: '', avatar: '', social: '' }
        ],
        categories: [
            { name: '', description: '' }
        ],
        tags: [
            { name: '' }
        ],
        popularPosts: [
            { title: '', snippet: '', link: '' }
        ],
        sidebar: {
            aboutTitle: 'About the Author',
            aboutContent: '',
            highlight: '',
            authorImage: ''
        },
        newsletter: {
            headline: 'Join the newsletter',
            description: '',
            placeholder: 'Enter your email',
            successMessage: 'Thanks for subscribing!',
            ctaText: 'Subscribe'
        },
        socialLinks: {
            twitter: '',
            linkedin: '',
            instagram: '',
            youtube: '',
            rss: ''
        },
        designPreferences: {
            colorAccent: '',
            layoutStyle: 'grid',
            typography: 'modern',
            cardStyle: 'elevated',
            showSearch: true,
            showCategoryFilter: true,
            enableAnimations: true
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

        if (!formData.blogInfo.name || !formData.blogInfo.description || !formData.featuredPost.title) {
            alert('Please provide a blog name, description, and at least one featured post.')
            return
        }

        actions.generateWebsiteStart()

        try {
            const result = await actions.generateWebsite(
                state.websiteType.id,
                formData,
                state.colorScheme,
                state.uploadedAssets
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
        <div className="portfolio-form blog-form">
            <div className="form-header">
                <h2>Create Your Blog Website</h2>
                <p>Share your blog details so the AI can craft a modern, content-focused site.</p>
            </div>

            {state.loading && (
                <div className="generation-loading">
                    <div className="loading-content">
                        <div className="ai-loader">
                            <div className="ai-bubble ai-bubble-1"></div>
                            <div className="ai-bubble ai-bubble-2"></div>
                            <div className="ai-bubble ai-bubble-3"></div>
                        </div>
                        <h3>AI is generating your website...</h3>
                        <p>This may take up to 2 minutes. Please don't close this page.</p>
                        <div className="loading-progress">
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                            <div className="loading-steps">
                                <span className="step active">Processing content</span>
                                <span className="step">Building layout</span>
                                <span className="step">Styling pages</span>
                                <span className="step">Finalizing site</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>dY`� Blog Identity</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Blog Name *</label>
                            <input
                                type="text"
                                value={formData.blogInfo.name}
                                onChange={(e) => handleInputChange('blogInfo', 'name', e.target.value)}
                                placeholder="Modern Maker Journal"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tagline *</label>
                            <input
                                type="text"
                                value={formData.blogInfo.tagline}
                                onChange={(e) => handleInputChange('blogInfo', 'tagline', e.target.value)}
                                placeholder="Stories at the intersection of design and tech"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Blog Description *</label>
                            <textarea
                                value={formData.blogInfo.description}
                                onChange={(e) => handleInputChange('blogInfo', 'description', e.target.value)}
                                placeholder="Describe what readers can expect from your blog."
                                rows="3"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Target Audience</label>
                            <input
                                type="text"
                                value={formData.blogInfo.targetAudience}
                                onChange={(e) => handleInputChange('blogInfo', 'targetAudience', e.target.value)}
                                placeholder="Product teams, solo founders, etc."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Voice & Tone</label>
                            <select
                                value={formData.blogInfo.voice}
                                onChange={(e) => handleInputChange('blogInfo', 'voice', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="friendly">Friendly & Approachable</option>
                                <option value="professional">Professional & Authoritative</option>
                                <option value="playful">Playful & Conversational</option>
                                <option value="inspirational">Inspirational</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Publishing Frequency</label>
                            <input
                                type="text"
                                value={formData.blogInfo.publishFrequency}
                                onChange={(e) => handleInputChange('blogInfo', 'publishFrequency', e.target.value)}
                                placeholder="Weekly, bi-weekly, monthly"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hero CTA Text</label>
                            <input
                                type="text"
                                value={formData.blogInfo.heroCTA}
                                onChange={(e) => handleInputChange('blogInfo', 'heroCTA', e.target.value)}
                                placeholder="Start Reading"
                                disabled={state.loading}
                            />
                            <div className="field-hint">CTA = Call to Action. This is the button text.</div>
                        </div>
                        <div className="form-group">
                            <label>Hero CTA Link</label>
                            <input
                                type="url"
                                value={formData.blogInfo.heroCTALink}
                                onChange={(e) => handleInputChange('blogInfo', 'heroCTALink', e.target.value)}
                                placeholder="https://yourblog.com/latest"
                                disabled={state.loading}
                            />
                            <div className="field-hint">Where the hero button should send visitors.</div>
                        </div>
                        <ImageUploadInput
                            label="Logo"
                            value={formData.blogInfo.logo}
                            onChange={(value) => handleInputChange('blogInfo', 'logo', value)}
                            placeholder="Upload or paste a logo"
                            disabled={state.loading}
                            hint="Upload your logo or paste a hosted URL."
                        />
                        <ImageUploadInput
                            label="Hero Image"
                            value={formData.blogInfo.heroImage}
                            onChange={(value) => handleInputChange('blogInfo', 'heroImage', value)}
                            placeholder="Upload or paste a hero image"
                            disabled={state.loading}
                            hint="Large hero visual for your landing section."
                        />
                    </div>
                </div>
                <div className="form-section">
                    <h3>dYs? Featured Post</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={formData.featuredPost.title}
                                onChange={(e) => handleInputChange('featuredPost', 'title', e.target.value)}
                                placeholder="The 2025 Guide to Product Storytelling"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Excerpt *</label>
                            <textarea
                                value={formData.featuredPost.excerpt}
                                onChange={(e) => handleInputChange('featuredPost', 'excerpt', e.target.value)}
                                rows="3"
                                placeholder="Summarize why this post matters."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                value={formData.featuredPost.category}
                                onChange={(e) => handleInputChange('featuredPost', 'category', e.target.value)}
                                placeholder="Product Strategy"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Publish Date</label>
                            <input
                                type="date"
                                value={formData.featuredPost.publishDate}
                                onChange={(e) => handleInputChange('featuredPost', 'publishDate', e.target.value)}
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Read Time</label>
                            <input
                                type="text"
                                value={formData.featuredPost.readTime}
                                onChange={(e) => handleInputChange('featuredPost', 'readTime', e.target.value)}
                                placeholder="8 min read"
                                disabled={state.loading}
                            />
                        </div>
                        <ImageUploadInput
                            label="Cover Image"
                            value={formData.featuredPost.image}
                            onChange={(value) => handleInputChange('featuredPost', 'image', value)}
                            placeholder="Upload or paste a cover image"
                            disabled={state.loading}
                            hint="Image used on the hero feature."
                        />
                        <div className="form-group full-width">
                            <label>Link / Slug</label>
                            <input
                                type="url"
                                value={formData.featuredPost.link}
                                onChange={(e) => handleInputChange('featuredPost', 'link', e.target.value)}
                                placeholder="https://yourblog.com/posts/product-storytelling"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-section">
                    <div className="section-header">
                        <h3>dY"� Blog Posts</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('posts', { title: '', excerpt: '', category: '', tags: '', publishDate: '', readTime: '', image: '', link: '', isPinned: false })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Post
                        </button>
                    </div>
                    {formData.posts.map((post, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Post {index + 1}</h4>
                                {formData.posts.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('posts', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        value={post.title}
                                        onChange={(e) => handleArrayChange('posts', index, 'title', e.target.value)}
                                        placeholder="How to run better retros"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        value={post.category}
                                        onChange={(e) => handleArrayChange('posts', index, 'category', e.target.value)}
                                        placeholder="Leadership"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={post.tags}
                                        onChange={(e) => handleArrayChange('posts', index, 'tags', e.target.value)}
                                        placeholder="team culture, process"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Publish Date</label>
                                    <input
                                        type="date"
                                        value={post.publishDate}
                                        onChange={(e) => handleArrayChange('posts', index, 'publishDate', e.target.value)}
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Read Time</label>
                                    <input
                                        type="text"
                                        value={post.readTime}
                                        onChange={(e) => handleArrayChange('posts', index, 'readTime', e.target.value)}
                                        placeholder="6 min"
                                        disabled={state.loading}
                                    />
                                </div>
                                    <ImageUploadInput
                                        label="Cover Image"
                                        value={post.image}
                                        onChange={(value) => handleArrayChange('posts', index, 'image', value)}
                                        placeholder="Upload or paste a cover image"
                                        disabled={state.loading}
                                        hint="Image shown on the blog card."
                                    />
                                <div className="form-group">
                                    <label>Link / Slug</label>
                                    <input
                                        type="url"
                                        value={post.link}
                                        onChange={(e) => handleArrayChange('posts', index, 'link', e.target.value)}
                                        placeholder="https://yourblog.com/posts/better-retros"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={post.isPinned}
                                            onChange={(e) => handleArrayChange('posts', index, 'isPinned', e.target.checked)}
                                            disabled={state.loading}
                                        />
                                        <span className="checkmark"></span>
                                        Mark as highlighted post
                                    </label>
                                </div>
                                <div className="form-group full-width">
                                    <label>Excerpt</label>
                                    <textarea
                                        value={post.excerpt}
                                        onChange={(e) => handleArrayChange('posts', index, 'excerpt', e.target.value)}
                                        rows="2"
                                        placeholder="Brief preview of the article"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-section">
                    <div className="section-header">
                        <h3>dY"� Authors & Contributors</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('authors', { name: '', bio: '', expertise: '', avatar: '', social: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Author
                        </button>
                    </div>
                    {formData.authors.map((author, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Author {index + 1}</h4>
                                {formData.authors.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('authors', index)}
                                        className="btn-remove"
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
                                        value={author.name}
                                        onChange={(e) => handleArrayChange('authors', index, 'name', e.target.value)}
                                        placeholder="Jamie Cole"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Expertise</label>
                                    <input
                                        type="text"
                                        value={author.expertise}
                                        onChange={(e) => handleArrayChange('authors', index, 'expertise', e.target.value)}
                                        placeholder="Product Strategy"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Short Bio</label>
                                    <textarea
                                        value={author.bio}
                                        onChange={(e) => handleArrayChange('authors', index, 'bio', e.target.value)}
                                        rows="2"
                                        placeholder="Tell readers about the author"
                                        disabled={state.loading}
                                    />
                                </div>
                                <ImageUploadInput
                                    label="Photo / Avatar"
                                    value={author.avatar}
                                    onChange={(value) => handleArrayChange('authors', index, 'avatar', value)}
                                    placeholder="Upload or paste an author photo"
                                    disabled={state.loading}
                                    hint="Appears with the author bio."
                                />
                                <div className="form-group">
                                    <label>Primary Social Link</label>
                                    <input
                                        type="url"
                                        value={author.social}
                                        onChange={(e) => handleArrayChange('authors', index, 'social', e.target.value)}
                                        placeholder="https://twitter.com/jamiewrites"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-section">
                    <h3>dY$" Sidebar & Metadata</h3>
                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>About Widget</h4>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>About Title</label>
                                <input
                                    type="text"
                                    value={formData.sidebar.aboutTitle}
                                    onChange={(e) => handleInputChange('sidebar', 'aboutTitle', e.target.value)}
                                    placeholder="Hi, I'm Jamie"
                                    disabled={state.loading}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>About Content</label>
                                <textarea
                                    value={formData.sidebar.aboutContent}
                                    onChange={(e) => handleInputChange('sidebar', 'aboutContent', e.target.value)}
                                    rows="3"
                                    placeholder="Share a quick intro for the sidebar."
                                    disabled={state.loading}
                                />
                            </div>
                                <ImageUploadInput
                                    label="Author Image"
                                    value={formData.sidebar.authorImage}
                                    onChange={(value) => handleInputChange('sidebar', 'authorImage', value)}
                                    placeholder="Upload or paste an author image"
                                    disabled={state.loading}
                                    hint="Shown in the sidebar bio."
                                />
                            <div className="form-group">
                                <label>Highlight / Quote</label>
                                <input
                                    type="text"
                                    value={formData.sidebar.highlight}
                                    onChange={(e) => handleInputChange('sidebar', 'highlight', e.target.value)}
                                    placeholder="Sharing lessons from 10+ years in product"
                                    disabled={state.loading}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>Categories</h4>
                            <button
                                type="button"
                                onClick={() => addArrayItem('categories', { name: '', description: '' })}
                                className="btn-add"
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
                                            onClick={() => removeArrayItem('categories', index)}
                                            className="btn-remove"
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
                                            placeholder="Creative Ops"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description / blurb</label>
                                        <textarea
                                            value={category.description}
                                            onChange={(e) => handleArrayChange('categories', index, 'description', e.target.value)}
                                            rows="2"
                                            placeholder="What goes into this category?"
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>Popular Posts</h4>
                            <button
                                type="button"
                                onClick={() => addArrayItem('popularPosts', { title: '', snippet: '', link: '' })}
                                className="btn-add"
                                disabled={state.loading}
                            >
                                + Add Popular Post
                            </button>
                        </div>
                        {formData.popularPosts.map((item, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Post {index + 1}</h5>
                                    {formData.popularPosts.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('popularPosts', index)}
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
                                            value={item.title}
                                            onChange={(e) => handleArrayChange('popularPosts', index, 'title', e.target.value)}
                                            placeholder="Design Systems 101"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Snippet</label>
                                        <textarea
                                            value={item.snippet}
                                            onChange={(e) => handleArrayChange('popularPosts', index, 'snippet', e.target.value)}
                                            rows="2"
                                            placeholder="One-liner for the sidebar"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Link</label>
                                        <input
                                            type="url"
                                            value={item.link}
                                            onChange={(e) => handleArrayChange('popularPosts', index, 'link', e.target.value)}
                                            placeholder="https://yourblog.com/posts/design-systems"
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>Tag Highlights</h4>
                            <button
                                type="button"
                                onClick={() => addArrayItem('tags', { name: '' })}
                                className="btn-add"
                                disabled={state.loading}
                            >
                                + Add Tag
                            </button>
                        </div>
                        {formData.tags.map((tag, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Tag {index + 1}</h5>
                                    {formData.tags.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('tags', index)}
                                            className="btn-remove"
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
                                            value={tag.name}
                                            onChange={(e) => handleArrayChange('tags', index, 'name', e.target.value)}
                                            placeholder="UX Research"
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-section">
                    <h3>dY"? Newsletter & Social</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Newsletter Headline</label>
                            <input
                                type="text"
                                value={formData.newsletter.headline}
                                onChange={(e) => handleInputChange('newsletter', 'headline', e.target.value)}
                                placeholder="Stay in the loop"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Newsletter Description</label>
                            <textarea
                                rows="2"
                                value={formData.newsletter.description}
                                onChange={(e) => handleInputChange('newsletter', 'description', e.target.value)}
                                placeholder="What will subscribers receive?"
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
                        <div className="form-group full-width">
                            <label>Success Message</label>
                            <input
                                type="text"
                                value={formData.newsletter.successMessage}
                                onChange={(e) => handleInputChange('newsletter', 'successMessage', e.target.value)}
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
                                placeholder="https://x.com/yourblog"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin}
                                onChange={(e) => handleInputChange('socialLinks', 'linkedin', e.target.value)}
                                placeholder="https://linkedin.com/company/yourblog"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Instagram</label>
                            <input
                                type="url"
                                value={formData.socialLinks.instagram}
                                onChange={(e) => handleInputChange('socialLinks', 'instagram', e.target.value)}
                                placeholder="https://instagram.com/yourblog"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>YouTube</label>
                            <input
                                type="url"
                                value={formData.socialLinks.youtube}
                                onChange={(e) => handleInputChange('socialLinks', 'youtube', e.target.value)}
                                placeholder="https://youtube.com/@yourblog"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>RSS Link</label>
                            <input
                                type="url"
                                value={formData.socialLinks.rss}
                                onChange={(e) => handleInputChange('socialLinks', 'rss', e.target.value)}
                                placeholder="https://yourblog.com/rss.xml"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-section">
                    <h3>dY"� Design Preferences</h3>
                    <p className="section-description">Optional settings to guide the AI on layout & interactions.</p>
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
                                <option value="grid">Grid cards</option>
                                <option value="list">List with hero</option>
                                <option value="magazine">Magazine style</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Typography</label>
                            <select
                                value={formData.designPreferences.typography}
                                onChange={(e) => handleInputChange('designPreferences', 'typography', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="modern">Modern sans-serif</option>
                                <option value="serif">Editorial serif</option>
                                <option value="mono">Tech monospace</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Card Style</label>
                            <select
                                value={formData.designPreferences.cardStyle}
                                onChange={(e) => handleInputChange('designPreferences', 'cardStyle', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="elevated">Elevated with shadow</option>
                                <option value="bordered">Bordered</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.showSearch}
                                onChange={(e) => handleInputChange('designPreferences', 'showSearch', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Include search bar
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.showCategoryFilter}
                                onChange={(e) => handleInputChange('designPreferences', 'showCategoryFilter', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Add category filter pills
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.enableAnimations}
                                onChange={(e) => handleInputChange('designPreferences', 'enableAnimations', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Use subtle hover animations
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
                            �?3 This may take 1-2 minutes. Please be patient while AI builds your blog.
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default BlogForm
