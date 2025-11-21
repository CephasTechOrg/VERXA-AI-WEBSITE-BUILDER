import React from 'react'
import { useApp } from '../../contexts/AppContext'
import './Preview.css'

const Preview = () => {
    const { state, actions } = useApp()

    const handleRegenerate = () => {
        actions.goBack('generator')
    }

    const handleNewWebsite = () => {
        actions.resetGenerator()
    }

    const handleDownload = () => {
        const downloadUrl = state.generatedWebsite?.data?.downloadUrl
        if (!downloadUrl) {
            alert('No download is available yet.')
            return
        }
        window.open(downloadUrl, '_blank')
    }

    if (!state.generatedWebsite) {
        return (
            <div className="preview-error">
                <h2>No Website Generated</h2>
                <p>Please go back and generate a website first.</p>
                <button onClick={handleNewWebsite} className="btn btn-primary">
                    Create New Website
                </button>
            </div>
        )
    }

    return (
        <div className="preview">
            <div className="preview-header">
                <h2>🎉 Your Website is Ready!</h2>
                <p>Preview your generated {state.websiteType?.name} website below</p>
            </div>

            <div className="preview-actions">
                <button onClick={handleRegenerate} className="btn btn-secondary">
                    🔄 Regenerate
                </button>
                <button onClick={handleDownload} className="btn btn-primary">
                    ⬇️ Download Website
                </button>
                <button onClick={handleNewWebsite} className="btn btn-outline">
                    🏠 Create New Website
                </button>
            </div>

            <div className="preview-container">
                <div className="preview-info">
                    <p><strong>Website Type:</strong> {state.websiteType?.name}</p>
                    <p><strong>Generated at:</strong> {new Date().toLocaleString()}</p>
                </div>

                <div className="website-preview">
                    <h3>Live Preview</h3>
                    <iframe
                        title="Generated Website Preview"
                        srcDoc={state.generatedWebsite.data?.html || '<h1>No content generated</h1>'}
                        className="preview-iframe"
                    />
                </div>

                <div className="preview-tips">
                    <h4>💡 Tips:</h4>
                    <ul>
                        <li>Your website is ready to use! Download the HTML file.</li>
                        <li>You can host this on any web server or use services like GitHub Pages, Netlify, or Vercel.</li>
                        <li>To make changes, edit the downloaded HTML file or regenerate with different content.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Preview
