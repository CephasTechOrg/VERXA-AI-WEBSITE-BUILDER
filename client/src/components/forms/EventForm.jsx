import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import ColorPicker from './ColorPicker'
import ImageUploadInput from './ImageUploadInput'
import './PortfolioForm.css'

const EventForm = () => {
    const { state, actions } = useApp()
    const [formData, setFormData] = useState({
        eventInfo: {
            name: '',
            tagline: '',
            description: '',
            date: '',
            endDate: '',
            time: '',
            venue: '',
            address: '',
            city: '',
            host: '',
            expectedGuests: '',
            heroImage: '',
            registrationLink: ''
        },
        schedule: [
            { time: '', title: '', speaker: '', location: '', description: '' }
        ],
        speakers: [
            { name: '', title: '', bio: '', photo: '', socials: '' }
        ],
        tickets: [
            { tier: '', price: '', perks: '', availability: '' }
        ],
        faqs: [
            { question: '', answer: '' }
        ],
        sponsors: [
            { name: '', level: '', website: '' }
        ],
        contact: {
            email: '',
            phone: '',
            whatsapp: '',
            instagram: '',
            website: ''
        },
        designPreferences: {
            colorAccent: '',
            theme: 'vibrant',
            layoutStyle: 'single-page',
            showCountdown: true,
            showMapEmbed: true,
            showTestimonials: false
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

        if (!formData.eventInfo.name || !formData.eventInfo.date || !formData.eventInfo.description) {
            alert('Please provide the event name, date, and description.')
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
            } else if (error.message.toLowerCase().includes('network')) {
                alert('Network error. Please check your connection and retry.')
            } else {
                alert(`Generation failed: ${error.message}`)
            }
        }
    }

    return (
        <div className="portfolio-form event-form">
            <div className="form-header">
                <h2>Plan Your Event Website</h2>
                <p>Share event details so the AI can craft a vibrant, engaging event site.</p>
            </div>

            {state.loading && (
                <div className="generation-loading">
                    <div className="loading-content">
                        <div className="ai-loader">
                            <div className="ai-bubble ai-bubble-1"></div>
                            <div className="ai-bubble ai-bubble-2"></div>
                            <div className="ai-bubble ai-bubble-3"></div>
                        </div>
                        <h3>AI is preparing your event experience...</h3>
                        <p>This usually takes under 2 minutes. Please keep this tab open.</p>
                        <div className="loading-progress">
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                            <div className="loading-steps">
                                <span className="step active">Gathering details</span>
                                <span className="step">Designing layout</span>
                                <span className="step">Adding interactions</span>
                                <span className="step">Finalizing site</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Event Overview</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Event Name *</label>
                            <input
                                type="text"
                                value={formData.eventInfo.name}
                                onChange={(e) => handleInputChange('eventInfo', 'name', e.target.value)}
                                placeholder="Future of Tech Summit"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tagline</label>
                            <input
                                type="text"
                                value={formData.eventInfo.tagline}
                                onChange={(e) => handleInputChange('eventInfo', 'tagline', e.target.value)}
                                placeholder="Innovate. Inspire. Impact."
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Event Description *</label>
                            <textarea
                                value={formData.eventInfo.description}
                                onChange={(e) => handleInputChange('eventInfo', 'description', e.target.value)}
                                placeholder="Share the purpose, highlights, and reasons to attend."
                                rows="3"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Start Date *</label>
                            <input
                                type="date"
                                value={formData.eventInfo.date}
                                onChange={(e) => handleInputChange('eventInfo', 'date', e.target.value)}
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={formData.eventInfo.endDate}
                                onChange={(e) => handleInputChange('eventInfo', 'endDate', e.target.value)}
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Time</label>
                            <input
                                type="text"
                                value={formData.eventInfo.time}
                                onChange={(e) => handleInputChange('eventInfo', 'time', e.target.value)}
                                placeholder="9:00 AM - 5:00 PM"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Venue</label>
                            <input
                                type="text"
                                value={formData.eventInfo.venue}
                                onChange={(e) => handleInputChange('eventInfo', 'venue', e.target.value)}
                                placeholder="Innovation Hall Center"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                value={formData.eventInfo.address}
                                onChange={(e) => handleInputChange('eventInfo', 'address', e.target.value)}
                                placeholder="123 Market Street"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>City / Region</label>
                            <input
                                type="text"
                                value={formData.eventInfo.city}
                                onChange={(e) => handleInputChange('eventInfo', 'city', e.target.value)}
                                placeholder="San Francisco, CA"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Host / Organizer</label>
                            <input
                                type="text"
                                value={formData.eventInfo.host}
                                onChange={(e) => handleInputChange('eventInfo', 'host', e.target.value)}
                                placeholder="Pulse Conference Group"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Expected Guests</label>
                            <input
                                type="text"
                                value={formData.eventInfo.expectedGuests}
                                onChange={(e) => handleInputChange('eventInfo', 'expectedGuests', e.target.value)}
                                placeholder="500+ attendees"
                                disabled={state.loading}
                            />
                        </div>
                        <ImageUploadInput
                            label="Hero Image"
                            value={formData.eventInfo.heroImage}
                            onChange={(value) => handleInputChange('eventInfo', 'heroImage', value)}
                            placeholder="Upload or paste a hero image"
                            disabled={state.loading}
                            hint="Large visual for the event hero section."
                        />
                        <div className="form-group">
                            <label>Registration Link</label>
                            <input
                                type="url"
                                value={formData.eventInfo.registrationLink}
                                onChange={(e) => handleInputChange('eventInfo', 'registrationLink', e.target.value)}
                                placeholder="https://tickets.example.com"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-section">
                    <div className="section-header">
                        <h3>Schedule</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('schedule', { time: '', title: '', speaker: '', location: '', description: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Session
                        </button>
                    </div>
                    {formData.schedule.map((session, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Session {index + 1}</h4>
                                {formData.schedule.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('schedule', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Time</label>
                                    <input
                                        type="text"
                                        value={session.time}
                                        onChange={(e) => handleArrayChange('schedule', index, 'time', e.target.value)}
                                        placeholder="10:30 AM"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        value={session.title}
                                        onChange={(e) => handleArrayChange('schedule', index, 'title', e.target.value)}
                                        placeholder="Opening Keynote"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Speaker</label>
                                    <input
                                        type="text"
                                        value={session.speaker}
                                        onChange={(e) => handleArrayChange('schedule', index, 'speaker', e.target.value)}
                                        placeholder="Jordan Lee"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={session.location}
                                        onChange={(e) => handleArrayChange('schedule', index, 'location', e.target.value)}
                                        placeholder="Main Hall"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={session.description}
                                        onChange={(e) => handleArrayChange('schedule', index, 'description', e.target.value)}
                                        rows="2"
                                        placeholder="What happens during this session?"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Speakers & Performers</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('speakers', { name: '', title: '', bio: '', photo: '', socials: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Speaker
                        </button>
                    </div>
                    {formData.speakers.map((speaker, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Speaker {index + 1}</h4>
                                {formData.speakers.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('speakers', index)}
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
                                        value={speaker.name}
                                        onChange={(e) => handleArrayChange('speakers', index, 'name', e.target.value)}
                                        placeholder="Samira Patel"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Title / Role</label>
                                    <input
                                        type="text"
                                        value={speaker.title}
                                        onChange={(e) => handleArrayChange('speakers', index, 'title', e.target.value)}
                                        placeholder="Chief Product Officer"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Short Bio</label>
                                    <textarea
                                        value={speaker.bio}
                                        onChange={(e) => handleArrayChange('speakers', index, 'bio', e.target.value)}
                                        rows="2"
                                        placeholder="Highlight expertise or key achievements."
                                        disabled={state.loading}
                                    />
                                </div>
                                <ImageUploadInput
                                    label="Photo"
                                    value={speaker.photo}
                                    onChange={(value) => handleArrayChange('speakers', index, 'photo', value)}
                                    placeholder="Upload or paste a speaker photo"
                                    disabled={state.loading}
                                    hint="Headshot for this speaker."
                                />
                                <div className="form-group">
                                    <label>Social / Website</label>
                                    <input
                                        type="url"
                                        value={speaker.socials}
                                        onChange={(e) => handleArrayChange('speakers', index, 'socials', e.target.value)}
                                        placeholder="https://linkedin.com/in/samira"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-section">
                    <div className="section-header">
                        <h3>Ticketing</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('tickets', { tier: '', price: '', perks: '', availability: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Ticket Tier
                        </button>
                    </div>
                    {formData.tickets.map((ticket, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Ticket {index + 1}</h4>
                                {formData.tickets.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('tickets', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Tier Name *</label>
                                    <input
                                        type="text"
                                        value={ticket.tier}
                                        onChange={(e) => handleArrayChange('tickets', index, 'tier', e.target.value)}
                                        placeholder="VIP Pass"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="text"
                                        value={ticket.price}
                                        onChange={(e) => handleArrayChange('tickets', index, 'price', e.target.value)}
                                        placeholder="$299"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Perks / Benefits</label>
                                    <textarea
                                        value={ticket.perks}
                                        onChange={(e) => handleArrayChange('tickets', index, 'perks', e.target.value)}
                                        rows="2"
                                        placeholder="Front-row seating, lounge access..."
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Availability Notes</label>
                                    <input
                                        type="text"
                                        value={ticket.availability}
                                        onChange={(e) => handleArrayChange('tickets', index, 'availability', e.target.value)}
                                        placeholder="Limited to 50 seats"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <h3>FAQs & Sponsors</h3>
                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>FAQs</h4>
                            <button
                                type="button"
                                onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
                                className="btn-add"
                                disabled={state.loading}
                            >
                                + Add FAQ
                            </button>
                        </div>
                        {formData.faqs.map((faq, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>FAQ {index + 1}</h5>
                                    {formData.faqs.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('faqs', index)}
                                            className="btn-remove"
                                            disabled={state.loading}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Question</label>
                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) => handleArrayChange('faqs', index, 'question', e.target.value)}
                                            placeholder="Is parking available?"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Answer</label>
                                        <textarea
                                            value={faq.answer}
                                            onChange={(e) => handleArrayChange('faqs', index, 'answer', e.target.value)}
                                            rows="2"
                                            placeholder="Yes, complimentary parking is provided for all attendees."
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>Sponsors</h4>
                            <button
                                type="button"
                                onClick={() => addArrayItem('sponsors', { name: '', level: '', website: '' })}
                                className="btn-add"
                                disabled={state.loading}
                            >
                                + Add Sponsor
                            </button>
                        </div>
                        {formData.sponsors.map((sponsor, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Sponsor {index + 1}</h5>
                                    {formData.sponsors.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('sponsors', index)}
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
                                            value={sponsor.name}
                                            onChange={(e) => handleArrayChange('sponsors', index, 'name', e.target.value)}
                                            placeholder="Aurora Systems"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Level</label>
                                        <input
                                            type="text"
                                            value={sponsor.level}
                                            onChange={(e) => handleArrayChange('sponsors', index, 'level', e.target.value)}
                                            placeholder="Platinum, Gold, Community..."
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Website</label>
                                        <input
                                            type="url"
                                            value={sponsor.website}
                                            onChange={(e) => handleArrayChange('sponsors', index, 'website', e.target.value)}
                                            placeholder="https://sponsor.com"
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Contact & Design</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Contact Email *</label>
                            <input
                                type="email"
                                value={formData.contact.email}
                                onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                                placeholder="hello@event.com"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                value={formData.contact.phone}
                                onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                                placeholder="+1 (555) 012-3456"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>WhatsApp</label>
                            <input
                                type="text"
                                value={formData.contact.whatsapp}
                                onChange={(e) => handleInputChange('contact', 'whatsapp', e.target.value)}
                                placeholder="+1 (555) 777-9999"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Instagram</label>
                            <input
                                type="url"
                                value={formData.contact.instagram}
                                onChange={(e) => handleInputChange('contact', 'instagram', e.target.value)}
                                placeholder="https://instagram.com/yourevent"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Website</label>
                            <input
                                type="url"
                                value={formData.contact.website}
                                onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
                                placeholder="https://yourevent.com"
                                disabled={state.loading}
                            />
                        </div>
                    </div>

                    <div className="form-section inner">
                        <h3>Design Preferences</h3>
                        <p className="section-description">Optional cues to guide styling and interactions.</p>
                        <div className="form-grid">
                            <div className="form-group">
                                <ColorPicker
                                    label="Accent Color"
                                    value={formData.designPreferences.colorAccent}
                                    onChange={(color) => handleInputChange('designPreferences', 'colorAccent', color)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Theme</label>
                                <select
                                    value={formData.designPreferences.theme}
                                    onChange={(e) => handleInputChange('designPreferences', 'theme', e.target.value)}
                                    disabled={state.loading}
                                >
                                    <option value="vibrant">Vibrant & Energetic</option>
                                    <option value="elegant">Elegant & Minimal</option>
                                    <option value="corporate">Corporate & Clean</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Layout Style</label>
                                <select
                                    value={formData.designPreferences.layoutStyle}
                                    onChange={(e) => handleInputChange('designPreferences', 'layoutStyle', e.target.value)}
                                    disabled={state.loading}
                                >
                                    <option value="single-page">Single page</option>
                                    <option value="multi-section">Multi section</option>
                                    <option value="split">Split hero layout</option>
                                </select>
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.designPreferences.showCountdown}
                                    onChange={(e) => handleInputChange('designPreferences', 'showCountdown', e.target.checked)}
                                    disabled={state.loading}
                                />
                                <span className="checkmark"></span>
                                Display countdown timer
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.designPreferences.showMapEmbed}
                                    onChange={(e) => handleInputChange('designPreferences', 'showMapEmbed', e.target.checked)}
                                    disabled={state.loading}
                                />
                                <span className="checkmark"></span>
                                Embed venue map
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.designPreferences.showTestimonials}
                                    onChange={(e) => handleInputChange('designPreferences', 'showTestimonials', e.target.checked)}
                                    disabled={state.loading}
                                />
                                <span className="checkmark"></span>
                                Highlight attendee testimonials
                            </label>
                        </div>
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
                            ??3 This may take 1-2 minutes. Please be patient while AI prepares your event site.
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default EventForm
