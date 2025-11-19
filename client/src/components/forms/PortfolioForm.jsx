import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import ColorPicker from './ColorPicker'
import './PortfolioForm.css'

const PortfolioForm = () => {
    const { state, actions } = useApp()
    const [formData, setFormData] = useState({
        personalInfo: {
            name: '',
            title: '',
            bio: '',
            profileImage: '',
            email: '',
            phone: '',
            location: ''
        },
        skills: [{ name: '', level: 'Intermediate' }],
        projects: [{ title: '', description: '', image: '', link: '' }],
        socialLinks: {
            github: '',
            linkedin: '',
            twitter: '',
            website: ''
        },
        // NEW FIELDS
        designPreferences: {
            colorAccent: '', // Optional custom color
            layoutStyle: 'modern', // modern, minimal, creative, professional
            animations: true, // Whether to include animations
            darkMode: true // Include dark mode toggle
        },
        additionalInfo: {
            certifications: [], // Array of certifications
            education: [], // Education background
            languages: [], // Languages spoken
            interests: [], // Personal interests/hobbies
            customSections: [] // Any additional sections user wants
        }
    })

    const handleInputChange = (section, field, value) => {
        // Support nested section paths like 'additionalInfo.languages'
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

    // Update the handleArrayChange to support both simple and nested paths
    const handleArrayChange = (path, index, field, value) => {
        const pathParts = path.split('.')

        if (pathParts.length === 1) {
            // Simple array
            setFormData(prev => ({
                ...prev,
                [path]: prev[path].map((item, i) =>
                    i === index ? { ...item, [field]: value } : item
                )
            }))
        } else {
            // Nested array
            setFormData(prev => ({
                ...prev,
                [pathParts[0]]: {
                    ...prev[pathParts[0]],
                    [pathParts[1]]: prev[pathParts[0]][pathParts[1]].map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    )
                }
            }))
        }
    }

    // Update the addArrayItem function to handle nested paths
    const addArrayItem = (path, template) => {
        const pathParts = path.split('.')

        if (pathParts.length === 1) {
            // Simple array (skills, projects)
            setFormData(prev => ({
                ...prev,
                [path]: [...prev[path], { ...template }]
            }))
        } else {
            // Nested array (additionalInfo.certifications, etc.)
            setFormData(prev => ({
                ...prev,
                [pathParts[0]]: {
                    ...prev[pathParts[0]],
                    [pathParts[1]]: [...prev[pathParts[0]][pathParts[1]], { ...template }]
                }
            }))
        }
    }

    const removeArrayItem = (path, index) => {
        const pathParts = path.split('.')

        if (pathParts.length === 1) {
            // Simple array
            setFormData(prev => ({
                ...prev,
                [path]: prev[path].filter((_, i) => i !== index)
            }))
        } else {
            // Nested array
            const array = formData[pathParts[0]][pathParts[1]];
            if (array.length > 1) {
                setFormData(prev => ({
                    ...prev,
                    [pathParts[0]]: {
                        ...prev[pathParts[0]],
                        [pathParts[1]]: prev[pathParts[0]][pathParts[1]].filter((_, i) => i !== index)
                    }
                }))
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.personalInfo.name || !formData.personalInfo.title || !formData.personalInfo.bio) {
            alert('Please fill in all required fields: Name, Title, and Bio')
            return
        }

        actions.generateWebsiteStart()

        try {
            console.log('🚀 Starting website generation...')
            const result = await actions.generateWebsite(
                state.websiteType.id,
                formData,
                state.colorScheme
            )
            console.log('✅ Generation successful:', result)
            actions.generateWebsiteSuccess(result)
        } catch (error) {
            console.error('❌ Generation failed:', error)
            actions.generateWebsiteError(error.message)

            // More user-friendly error messages
            if (error.message.includes('timeout')) {
                alert('Generation took too long. Please try again. The server might be busy.')
            } else if (error.message.includes('network') || error.message.includes('Network')) {
                alert('Network error. Please check your connection and try again.')
            } else {
                alert(`Generation failed: ${error.message}`)
            }
        }
    }

    return (
        <div className="portfolio-form">
            <div className="form-header">
                <h2>Create Your Portfolio</h2>
                <p>Fill in your details to generate a beautiful portfolio website</p>
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
                                <span className="step active">Processing your data</span>
                                <span className="step">Generating content</span>
                                <span className="step">Creating design</span>
                                <span className="step">Finalizing website</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="form-section">
                    <h3>👤 Personal Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                value={formData.personalInfo.name}
                                onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                                placeholder="John Doe"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Professional Title *</label>
                            <input
                                type="text"
                                value={formData.personalInfo.title}
                                onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                                placeholder="Frontend Developer"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Bio *</label>
                            <textarea
                                value={formData.personalInfo.bio}
                                onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                                rows="3"
                                placeholder="A passionate developer with 5+ years of experience..."
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Profile Image URL</label>
                            <input
                                type="url"
                                value={formData.personalInfo.profileImage}
                                onChange={(e) => handleInputChange('personalInfo', 'profileImage', e.target.value)}
                                placeholder="https://example.com/your-photo.jpg"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                value={formData.personalInfo.email}
                                onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                placeholder="john@example.com"
                                required
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={formData.personalInfo.phone}
                                onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                placeholder="+1234567890"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={formData.personalInfo.location}
                                onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                                placeholder="New York, USA"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="form-section">
                    <div className="section-header">
                        <h3>💪 Skills</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('skills', { name: '', level: 'Intermediate' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Skill
                        </button>
                    </div>
                    {formData.skills.map((skill, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Skill {index + 1}</h4>
                                {formData.skills.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('skills', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Skill Name *</label>
                                    <input
                                        type="text"
                                        value={skill.name}
                                        onChange={(e) => handleArrayChange('skills', index, 'name', e.target.value)}
                                        placeholder="JavaScript, React, Design"
                                        required
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Proficiency Level</label>
                                    <select
                                        value={skill.level}
                                        onChange={(e) => handleArrayChange('skills', index, 'level', e.target.value)}
                                        disabled={state.loading}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div className="form-section">
                    <div className="section-header">
                        <h3>🚀 Projects</h3>
                        <button
                            type="button"
                            onClick={() => addArrayItem('projects', { title: '', description: '', image: '', link: '' })}
                            className="btn-add"
                            disabled={state.loading}
                        >
                            + Add Project
                        </button>
                    </div>
                    {formData.projects.map((project, index) => (
                        <div key={index} className="array-item">
                            <div className="array-item-header">
                                <h4>Project {index + 1}</h4>
                                {formData.projects.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('projects', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Project Title *</label>
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                                        placeholder="E-commerce Website"
                                        required
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Project Image URL</label>
                                    <input
                                        type="url"
                                        value={project.image}
                                        onChange={(e) => handleArrayChange('projects', index, 'image', e.target.value)}
                                        placeholder="https://example.com/project-image.jpg"
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Project Description *</label>
                                    <textarea
                                        value={project.description}
                                        onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                                        rows="3"
                                        placeholder="Built a full-stack e-commerce platform with React and Node.js..."
                                        required
                                        disabled={state.loading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Project Link</label>
                                    <input
                                        type="url"
                                        value={project.link}
                                        onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                                        placeholder="https://example.com/live-demo"
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Links */}
                <div className="form-section">
                    <h3>🌐 Social Links</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>GitHub</label>
                            <input
                                type="url"
                                value={formData.socialLinks.github}
                                onChange={(e) => handleInputChange('socialLinks', 'github', e.target.value)}
                                placeholder="https://github.com/username"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin}
                                onChange={(e) => handleInputChange('socialLinks', 'linkedin', e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Twitter</label>
                            <input
                                type="url"
                                value={formData.socialLinks.twitter}
                                onChange={(e) => handleInputChange('socialLinks', 'twitter', e.target.value)}
                                placeholder="https://twitter.com/username"
                                disabled={state.loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Personal Website</label>
                            <input
                                type="url"
                                value={formData.socialLinks.website}
                                onChange={(e) => handleInputChange('socialLinks', 'website', e.target.value)}
                                placeholder="https://yourwebsite.com"
                                disabled={state.loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Design Preferences */}
                <div className="form-section">
                    <h3>🎨 Design Preferences</h3>
                    <p className="section-description">
                        Customize the look and feel of your portfolio (all optional)
                    </p>
                    <div className="form-grid">
                        <div className="form-group">
                            <ColorPicker
                                label="Primary Color Accent"
                                value={formData.designPreferences.colorAccent}
                                onChange={(color) => handleInputChange('designPreferences', 'colorAccent', color)}
                            />
                            <p className="field-hint">Choose a color theme for your website</p>
                        </div>

                        <div className="form-group">
                            <label>Layout Style</label>
                            <select
                                value={formData.designPreferences.layoutStyle}
                                onChange={(e) => handleInputChange('designPreferences', 'layoutStyle', e.target.value)}
                                disabled={state.loading}
                            >
                                <option value="modern">Modern & Clean</option>
                                <option value="minimal">Minimal</option>
                                <option value="creative">Creative & Bold</option>
                                <option value="professional">Professional</option>
                            </select>
                        </div>

                        <div className="form-group full-width design-options">
                            <label>Additional Features</label>
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.designPreferences.animations}
                                        onChange={(e) => handleInputChange('designPreferences', 'animations', e.target.checked)}
                                        disabled={state.loading}
                                    />
                                    <span className="checkmark"></span>
                                    Include Animations & Effects
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.designPreferences.darkMode}
                                        onChange={(e) => handleInputChange('designPreferences', 'darkMode', e.target.checked)}
                                        disabled={state.loading}
                                    />
                                    <span className="checkmark"></span>
                                    Include Dark/Light Mode Toggle
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="form-section">
                    <div className="section-header">
                        <h3>📚 Additional Information</h3>
                        <p className="section-description">
                            Add certifications, education, languages, and other details
                        </p>
                    </div>

                    {/* Certifications */}
                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>🏆 Certifications</h4>
                            <button
                                type="button"
                                onClick={() => addArrayItem('additionalInfo.certifications', { name: '', issuer: '', date: '', url: '' })}
                                className="btn-add"
                                disabled={state.loading}
                            >
                                + Add Certification
                            </button>
                        </div>
                        {formData.additionalInfo.certifications.map((cert, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Certification {index + 1}</h5>
                                    {formData.additionalInfo.certifications.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('additionalInfo.certifications', index)}
                                            className="btn-remove"
                                            disabled={state.loading}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Certification Name *</label>
                                        <input
                                            type="text"
                                            value={cert.name}
                                            onChange={(e) => handleArrayChange('additionalInfo.certifications', index, 'name', e.target.value)}
                                            placeholder="AWS Certified Developer"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Issuing Organization</label>
                                        <input
                                            type="text"
                                            value={cert.issuer}
                                            onChange={(e) => handleArrayChange('additionalInfo.certifications', index, 'issuer', e.target.value)}
                                            placeholder="Amazon Web Services"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date Received</label>
                                        <input
                                            type="text"
                                            value={cert.date}
                                            onChange={(e) => handleArrayChange('additionalInfo.certifications', index, 'date', e.target.value)}
                                            placeholder="June 2023"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Certificate URL</label>
                                        <input
                                            type="url"
                                            value={cert.url}
                                            onChange={(e) => handleArrayChange('additionalInfo.certifications', index, 'url', e.target.value)}
                                            placeholder="https://example.com/certificate"
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Education */}
                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>🎓 Education</h4>
                            <button
                                type="button"
                                onClick={() => addArrayItem('additionalInfo.education', { institution: '', degree: '', field: '', duration: '', description: '' })}
                                className="btn-add"
                                disabled={state.loading}
                            >
                                + Add Education
                            </button>
                        </div>
                        {formData.additionalInfo.education.map((edu, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Education {index + 1}</h5>
                                    {formData.additionalInfo.education.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('additionalInfo.education', index)}
                                            className="btn-remove"
                                            disabled={state.loading}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Institution *</label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => handleArrayChange('additionalInfo.education', index, 'institution', e.target.value)}
                                            placeholder="University of Technology"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Degree/Certificate</label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => handleArrayChange('additionalInfo.education', index, 'degree', e.target.value)}
                                            placeholder="Bachelor of Science in Computer Science"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Field of Study</label>
                                        <input
                                            type="text"
                                            value={edu.field}
                                            onChange={(e) => handleArrayChange('additionalInfo.education', index, 'field', e.target.value)}
                                            placeholder="Computer Science"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            value={edu.duration}
                                            onChange={(e) => handleArrayChange('additionalInfo.education', index, 'duration', e.target.value)}
                                            placeholder="2018 - 2022"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description/Achievements</label>
                                        <textarea
                                            value={edu.description}
                                            onChange={(e) => handleArrayChange('additionalInfo.education', index, 'description', e.target.value)}
                                            rows="2"
                                            placeholder="Relevant coursework, honors, or achievements..."
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Languages & Interests */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Languages Spoken</label>
                            <input
                                type="text"
                                value={formData.additionalInfo.languages.join(', ')}
                                onChange={(e) => handleInputChange('additionalInfo', 'languages', e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang))}
                                placeholder="English, Spanish, French"
                                disabled={state.loading}
                            />
                            <p className="field-hint">Separate with commas</p>
                        </div>

                        <div className="form-group">
                            <label>Interests & Hobbies</label>
                            <input
                                type="text"
                                value={formData.additionalInfo.interests.join(', ')}
                                onChange={(e) => handleInputChange('additionalInfo', 'interests', e.target.value.split(',').map(interest => interest.trim()).filter(interest => interest))}
                                placeholder="Photography, Hiking, Reading"
                                disabled={state.loading}
                            />
                            <p className="field-hint">Separate with commas</p>
                        </div>
                    </div>

                    {/* Custom Sections */}
                    <div className="subsection">
                        <div className="subsection-header">
                            <h4>➕ Custom Sections</h4>
                            <button
                                type="button"
                                onClick={() => addArrayItem('additionalInfo.customSections', { title: '', content: '' })}
                                className="btn-add"
                                disabled={state.loading}
                            >
                                + Add Custom Section
                            </button>
                        </div>
                        {formData.additionalInfo.customSections.map((section, index) => (
                            <div key={index} className="array-item">
                                <div className="array-item-header">
                                    <h5>Custom Section {index + 1}</h5>
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('additionalInfo.customSections', index)}
                                        className="btn-remove"
                                        disabled={state.loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Section Title *</label>
                                        <input
                                            type="text"
                                            value={section.title}
                                            onChange={(e) => handleArrayChange('additionalInfo.customSections', index, 'title', e.target.value)}
                                            placeholder="Volunteer Experience"
                                            disabled={state.loading}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Content *</label>
                                        <textarea
                                            value={section.content}
                                            onChange={(e) => handleArrayChange('additionalInfo.customSections', index, 'content', e.target.value)}
                                            rows="3"
                                            placeholder="Describe this section in detail..."
                                            disabled={state.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            ⏳ This may take 1-2 minutes. Please be patient while AI creates your website.
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default PortfolioForm