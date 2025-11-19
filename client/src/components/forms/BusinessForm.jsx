import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import ColorPicker from './ColorPicker'
import './PortfolioForm.css'

const BusinessForm = () => {
    const { state, actions } = useApp()
    const [formData, setFormData] = useState({
        companyInfo: {
            name: '',
            tagline: '',
            description: '',
            mission: '',
            vision: '',
            industry: '',
            location: '',
            story: '',
            values: '',
            logo: ''
        },
        heroSection: {
            headline: '',
            subheadline: '',
            primaryCTA: '',
            primaryLink: '',
            secondaryCTA: '',
            secondaryLink: '',
            heroImage: ''
        },
        services: [
            { title: '', summary: '', highlights: '' }
        ],
        teamMembers: [
            { name: '', role: '', bio: '', image: '', linkedin: '' }
        ],
        testimonials: [
            { name: '', company: '', quote: '' }
        ],
        contactInfo: {
            email: '',
            phone: '',
            address: '',
            hours: '',
            supportCTA: ''
        },
        socialLinks: {
            linkedin: '',
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: ''
        },
        designPreferences: {
            colorAccent: '',
            brandStyle: 'corporate',
            layoutStyle: 'modern',
            buttonStyle: 'rounded',
            includeAnimations: true,
            includeContactForm: true
        },
        additionalNotes: ''
    })

    const handleInputChange = (section, field, value) => {
        if (section.includes('.')) {
            const parts = section.split('.')
            setFormData(prev => {
                const next = JSON.parse(JSON.stringify(prev))
                let cur = next
                for (let i = 0; i < parts.length - 1; i++) {
                    cur = cur[parts[i]] = cur[parts[i]] || {}
                }
                const last = parts[parts.length - 1]
                cur[last] = {
                    ...cur[last],
                    [field]: value
                }
                return next
            })
            return
        }

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

        if (!formData.companyInfo.name || !formData.companyInfo.tagline || !formData.companyInfo.description) {
            alert('Please provide the company name, tagline, and description.')
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
        <div className="portfolio-form business-form">
            <div className="form-header">
                <h2>Create Your Business Website</h2>
                <p>Provide company details so the AI can generate a professional site tailored to your brand.</p>
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
                                <span className="step active">Processing company data</span>
                                <span className="step">Generating layout</span>
                                <span className="step">Applying styles</span>
                                <span className="step">Finalizing website</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Company & About</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                value={formData.companyInfo.name}
                                onChange={(e) => handleInputChange('companyInfo', 'name', e.target.value)}
                                placeholder="Acme Solutions"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tagline *</label>
                            <input
                                type="text"
                                value={formData.companyInfo.tagline}
                                onChange={(e) => handleInputChange('companyInfo', 'tagline', e.target.value)}
                                placeholder="We build products that scale."
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Industry</label>
                            <input
                                type="text"
                                value={formData.companyInfo.industry}
                                onChange={(e) => handleInputChange('companyInfo', 'industry', e.target.value)}
                                placeholder="Technology, Consulting, Retail..."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={formData.companyInfo.location}
                                onChange={(e) => handleInputChange('companyInfo', 'location', e.target.value)}
                                placeholder="Austin, TX"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Company Description *</label>
                            <textarea
                                value={formData.companyInfo.description}
                                onChange={(e) => handleInputChange('companyInfo', 'description', e.target.value)}
                                placeholder="Briefly describe what you do, who you serve, and the results you deliver."
                                rows="3"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mission Statement</label>
                            <textarea
                                value={formData.companyInfo.mission}
                                onChange={(e) => handleInputChange('companyInfo', 'mission', e.target.value)}
                                rows="2"
                                placeholder="Our mission is to..."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Vision / Future Goals</label>
                            <textarea
                                value={formData.companyInfo.vision}
                                onChange={(e) => handleInputChange('companyInfo', 'vision', e.target.value)}
                                rows="2"
                                placeholder="We envision..."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Company Story</label>
                            <textarea
                                value={formData.companyInfo.story}
                                onChange={(e) => handleInputChange('companyInfo', 'story', e.target.value)}
                                rows="3"
                                placeholder="Share your founding story or what makes your team unique."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Core Values / Differentiators</label>
                            <textarea
                                value={formData.companyInfo.values}
                                onChange={(e) => handleInputChange('companyInfo', 'values', e.target.value)}
                                rows="2"
                                placeholder="Customer-first, data-informed, fast execution..."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Logo URL</label>
                            <input
                                type="url"
                                value={formData.companyInfo.logo}
                                onChange={(e) => handleInputChange('companyInfo', 'logo', e.target.value)}
                                placeholder="https://cdn.example.com/logo.png"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-section">
                    <h3>Hero & CTA</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Hero Headline *</label>
                            <input
                                type="text"
                                value={formData.heroSection.headline}
                                onChange={(e) => handleInputChange('heroSection', 'headline', e.target.value)}
                                placeholder="Transform how your organization delivers"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Hero Supporting Text</label>
                            <textarea
                                value={formData.heroSection.subheadline}
                                onChange={(e) => handleInputChange('heroSection', 'subheadline', e.target.value)}
                                rows="2"
                                placeholder="Explain your value proposition in a sentence or two."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Primary CTA Text</label>
                            <input
                                type="text"
                                value={formData.heroSection.primaryCTA}
                                onChange={(e) => handleInputChange('heroSection', 'primaryCTA', e.target.value)}
                                placeholder="Start a project"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Primary CTA Link</label>
                            <input
                                type="url"
                                value={formData.heroSection.primaryLink}
                                onChange={(e) => handleInputChange('heroSection', 'primaryLink', e.target.value)}
                                placeholder="https://calendly.com/..."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Secondary CTA Text</label>
                            <input
                                type="text"
                                value={formData.heroSection.secondaryCTA}
                                onChange={(e) => handleInputChange('heroSection', 'secondaryCTA', e.target.value)}
                                placeholder="Download brochure"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Secondary CTA Link</label>
                            <input
                                type="url"
                                value={formData.heroSection.secondaryLink}
                                onChange={(e) => handleInputChange('heroSection', 'secondaryLink', e.target.value)}
                                placeholder="https://drive.google.com/..."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Hero Image / Video URL</label>
                            <input
                                type="url"
                                value={formData.heroSection.heroImage}
                                onChange={(e) => handleInputChange('heroSection', 'heroImage', e.target.value)}
                                placeholder="https://images.example.com/team.jpg"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3> Services</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('services', { title: '', summary: '', highlights: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Service
                        </button>
                    </div>
                    {formData.services.map((service, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Service {index + 1}</h4>
                                {formData.services.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('services', index)}
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
                                        value={service.title}
                                        onChange={(e) => handleArrayChange('services', index, 'title', e.target.value)}
                                        placeholder="Strategy Sprint"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description *</label>
                                    <textarea
                                        value={service.summary}
                                        onChange={(e) => handleArrayChange('services', index, 'summary', e.target.value)}
                                        rows="2"
                                        placeholder="Explain what the service includes and the outcome clients can expect."
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Highlights (comma separated)</label>
                                    <textarea
                                        value={service.highlights}
                                        onChange={(e) => handleArrayChange('services', index, 'highlights', e.target.value)}
                                        rows="2"
                                        placeholder="Roadmap, dedicated strategist, KPI tracking..."
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-section">
                    <div className="section-header">
                        <h3> Leadership & Team</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('teamMembers', { name: '', role: '', bio: '', image: '', linkedin: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Team Member
                        </button>
                    </div>
                    {formData.teamMembers.map((member, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Team Member {index + 1}</h4>
                                {formData.teamMembers.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('teamMembers', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Name *</label>
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => handleArrayChange('teamMembers', index, 'name', e.target.value)}
                                        placeholder="Jordan Lee"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role *</label>
                                    <input
                                        type="text"
                                        value={member.role}
                                        onChange={(e) => handleArrayChange('teamMembers', index, 'role', e.target.value)}
                                        placeholder="CEO"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Bio</label>
                                    <textarea
                                        value={member.bio}
                                        onChange={(e) => handleArrayChange('teamMembers', index, 'bio', e.target.value)}
                                        rows="2"
                                        placeholder="Highlight expertise, years of experience, or focus area."
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Photo URL</label>
                                    <input
                                        type="url"
                                        value={member.image}
                                        onChange={(e) => handleArrayChange('teamMembers', index, 'image', e.target.value)}
                                        placeholder="https://images.example.com/jordan.jpg"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>LinkedIn</label>
                                    <input
                                        type="url"
                                        value={member.linkedin}
                                        onChange={(e) => handleArrayChange('teamMembers', index, 'linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/in/jordan"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>dY"? Testimonials</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('testimonials', { name: '', company: '', quote: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Testimonial
                        </button>
                    </div>
                    {formData.testimonials.map((testimonial, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Testimonial {index + 1}</h4>
                                {formData.testimonials.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('testimonials', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Client Name</label>
                                    <input
                                        type="text"
                                        value={testimonial.name}
                                        onChange={(e) => handleArrayChange('testimonials', index, 'name', e.target.value)}
                                        placeholder="Alex Morgan"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company / Role</label>
                                    <input
                                        type="text"
                                        value={testimonial.company}
                                        onChange={(e) => handleArrayChange('testimonials', index, 'company', e.target.value)}
                                        placeholder="COO, Northwind"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Feedback Quote</label>
                                    <textarea
                                        value={testimonial.quote}
                                        onChange={(e) => handleArrayChange('testimonials', index, 'quote', e.target.value)}
                                        rows="2"
                                        placeholder="Share what stood out most in their experience with you."
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-section">
                    <h3>dY!0 Contact & Social</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Contact Email *</label>
                            <input
                                type="email"
                                value={formData.contactInfo.email}
                                onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                                placeholder="hello@acme.com"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                value={formData.contactInfo.phone}
                                onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Office Address</label>
                            <input
                                type="text"
                                value={formData.contactInfo.address}
                                onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                                placeholder="123 Market Street, Suite 500"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Business Hours</label>
                            <input
                                type="text"
                                value={formData.contactInfo.hours}
                                onChange={(e) => handleInputChange('contactInfo', 'hours', e.target.value)}
                                placeholder="Mon - Fri, 9am - 6pm"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Support CTA / Message</label>
                            <input
                                type="text"
                                value={formData.contactInfo.supportCTA}
                                onChange={(e) => handleInputChange('contactInfo', 'supportCTA', e.target.value)}
                                placeholder="Need help? We're just an email away."
                                disabled={state.loading}
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin}
                                onChange={(e) => handleInputChange('socialLinks', 'linkedin', e.target.value)}
                                placeholder="https://linkedin.com/company/acme"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Facebook</label>
                            <input
                                type="url"
                                value={formData.socialLinks.facebook}
                                onChange={(e) => handleInputChange('socialLinks', 'facebook', e.target.value)}
                                placeholder="https://facebook.com/acme"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Instagram</label>
                            <input
                                type="url"
                                value={formData.socialLinks.instagram}
                                onChange={(e) => handleInputChange('socialLinks', 'instagram', e.target.value)}
                                placeholder="https://instagram.com/acme"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Twitter / X</label>
                            <input
                                type="url"
                                value={formData.socialLinks.twitter}
                                onChange={(e) => handleInputChange('socialLinks', 'twitter', e.target.value)}
                                placeholder="https://x.com/acme"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>YouTube</label>
                            <input
                                type="url"
                                value={formData.socialLinks.youtube}
                                onChange={(e) => handleInputChange('socialLinks', 'youtube', e.target.value)}
                                placeholder="https://youtube.com/@acme"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-section">
                    <h3>dY"? Design Preferences</h3>
                    <p className="section-description">Optional: help the AI match your branding.</p>
                    <div className="form-grid">
                        <div className="form-group">
                            <ColorPicker
                                label="Accent / Brand Color"
                                value={formData.designPreferences.colorAccent}
                                onChange={(color) => handleInputChange('designPreferences', 'colorAccent', color)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Brand Style</label>
                            <select
                                value={formData.designPreferences.brandStyle}
                                onChange={(e) => handleInputChange('designPreferences', 'brandStyle', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="corporate">Corporate</option>
                                <option value="modern">Modern Minimal</option>
                                <option value="bold">Bold & Vibrant</option>
                                <option value="friendly">Friendly & Warm</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Layout Style</label>
                            <select
                                value={formData.designPreferences.layoutStyle}
                                onChange={(e) => handleInputChange('designPreferences', 'layoutStyle', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="modern">Modern sections</option>
                                <option value="boxed">Boxed cards</option>
                                <option value="minimal">Minimal & airy</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Button Style</label>
                            <select
                                value={formData.designPreferences.buttonStyle}
                                onChange={(e) => handleInputChange('designPreferences', 'buttonStyle', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="rounded">Rounded</option>
                                <option value="pill">Pill</option>
                                <option value="square">Square</option>
                            </select>
                        </div>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.includeAnimations}
                                onChange={(e) => handleInputChange('designPreferences', 'includeAnimations', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Include subtle animations
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.designPreferences.includeContactForm}
                                onChange={(e) => handleInputChange('designPreferences', 'includeContactForm', e.target.checked)}
                                disabled={state.loading}
                            />
                            <span className="checkmark"></span>
                            Add a contact form section
                        </label>
                    </div>
                    <div className="form-group">
                        <label>Additional Notes</label>
                        <textarea
                            value={formData.additionalNotes}
                            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                            rows="3"
                            placeholder="Share any compliance notes, sections to prioritize, or partner logos to highlight."
                            disabled={state.loading}
                        />
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
                            ??3 This may take 1-2 minutes. Please be patient while AI builds your website.
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default BusinessForm
