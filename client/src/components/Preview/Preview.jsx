import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { websiteAPI } from '../../services/api';
import './Preview.css';

const buildPreviewHtml = (html) => {
    if (!html) {
        return '<h1>No content generated</h1>';
    }

    const lower = html.toLowerCase();
    if (lower.includes('<base')) {
        return html;
    }

    const headMatch = html.match(/<head[^>]*>/i);
    const baseTag = '<base target="_blank" href="." />';

    if (headMatch) {
        return html.replace(headMatch[0], `${headMatch[0]}${baseTag}`);
    }

    return `<head>${baseTag}</head>${html}`;
};

const Preview = () => {
    const { state, actions } = useApp();
    const [deploying, setDeploying] = useState(false);
    const [deployResult, setDeployResult] = useState(null);
    const [deployError, setDeployError] = useState(null);

    const previewHtml = useMemo(
        () => buildPreviewHtml(state.generatedWebsite?.data?.html),
        [state.generatedWebsite]
    );

    useEffect(() => {
        setDeploying(false);
        setDeployResult(null);
        setDeployError(null);
    }, [state.generatedWebsite]);

    const handleRegenerate = () => {
        actions.goBack('generator');
    };

    const handleNewWebsite = () => {
        actions.resetGenerator();
    };

    const handleDownload = () => {
        if (state.generatedWebsite?.data?.html) {
            const blob = new Blob([state.generatedWebsite.data.html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${state.websiteType?.id || 'website'}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('No website content available to download');
        }
    };

    const handleDeploy = async () => {
        if (!state.generatedWebsite?.data?.html) {
            alert('Generate a website first before deploying.');
            return;
        }

        if (!state.lastGenerationRequest) {
            alert('Missing generation details. Please regenerate the website.');
            return;
        }

        setDeploying(true);
        setDeployError(null);

        try {
            // Send pre-generated HTML with original generation request details
            const downloadUrl = state.generatedWebsite?.data?.downloadUrl || '';
            const downloadId = downloadUrl ? downloadUrl.split('/').pop() : null;

            const deployPayload = {
                html: state.generatedWebsite.data.html,
                websiteType: state.lastGenerationRequest.websiteType,
                userData: state.lastGenerationRequest.userData,
                // Optional map of additional files to include in the deploy ZIP: { 'styles/main.css': '...'}
                files: state.generatedWebsite?.data?.extraFiles || {},
                downloadId
            };

            console.log('📤 Deploying with payload:', {
                html: `${deployPayload.html.substring(0, 50)}...`,
                websiteType: deployPayload.websiteType,
                userDataKeys: Object.keys(deployPayload.userData)
            });

            const response = await websiteAPI.deploy(deployPayload);
            setDeployResult(response.data);
            console.log('✅ Deployment successful:', response.data);
        } catch (error) {
            setDeployError(error.message || 'Deployment failed');
            console.error('❌ Deployment error:', error);
        } finally {
            setDeploying(false);
        }
    };

    if (!state.generatedWebsite) {
        return (
            <div className="preview-error">
                <h2>No Website Generated</h2>
                <p>Please go back and generate a website first.</p>
                <button onClick={handleNewWebsite} className="btn btn-primary">
                    Create New Website
                </button>
            </div>
        );
    }

    return (
        <div className="preview">
            <div className="preview-header">
                <h2>Your Website is Ready!</h2>
                <p>Preview your generated {state.websiteType?.name} website below</p>
            </div>

            <div className="preview-actions">
                <button onClick={handleRegenerate} className="btn btn-secondary">
                    Regenerate
                </button>
                <button onClick={handleDownload} className="btn btn-primary">
                    Download Website
                </button>
                <button
                    onClick={handleDeploy}
                    className="btn btn-deploy"
                    disabled={deploying}
                >
                    {deploying && <span className="button-spinner" />}
                    {deploying ? 'Deploying...' : 'Deploy to Netlify'}
                </button>
                <button onClick={handleNewWebsite} className="btn btn-outline">
                    Create New Website
                </button>
            </div>

            <div className="preview-container">
                <div className="preview-info">
                    <p><strong>Website Type:</strong> {state.websiteType?.name}</p>
                    <p><strong>Generated at:</strong> {new Date().toLocaleString()}</p>
                </div>

                {deployResult && (
                    <div className="deploy-result">
                        <h4>Netlify Deployment</h4>
                        <p>
                            <strong>Status:</strong> {deployResult.status || 'processing'}
                        </p>
                        {deployResult.siteUrl && (
                            <p>
                                <strong>Live URL:</strong>{' '}
                                <a
                                    href={deployResult.siteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {deployResult.siteUrl}
                                </a>
                            </p>
                        )}
                    </div>
                )}

                {deployError && (
                    <div className="deploy-error">
                        <strong>Deployment failed:</strong> {deployError}
                    </div>
                )}

                <div className="website-preview">
                    <h3>Live Preview</h3>
                    <iframe
                        title="Generated Website Preview"
                        srcDoc={previewHtml}
                        sandbox="allow-scripts allow-same-origin"
                        referrerPolicy="no-referrer"
                        className="preview-iframe"
                    />
                </div>

                <div className="preview-tips">
                    <h4>Tips:</h4>
                    <ul>
                        <li>Your website is ready to use! Download the HTML file.</li>
                        <li>You can host this on any web server or deploy to Netlify with one click.</li>
                        <li>To make changes, edit the downloaded HTML file or regenerate with different content.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Preview;

