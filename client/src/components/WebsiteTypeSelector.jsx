import React, { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import PortfolioForm from './forms/PortfolioForm'
import BusinessForm from './forms/BusinessForm'
import BlogForm from './forms/BlogForm'
import NewsForm from './forms/NewsForm'
import ArticleForm from './forms/ArticleForm'
import './WebsiteTypeSelector.css'

const WebsiteTypeSelector = () => {
    const { state, actions } = useApp()
    const [websiteTypes, setWebsiteTypes] = useState([
        { id: 'portfolio', name: 'Portfolio', description: 'Showcase your work and skills', icon: <i className="fas fa-briefcase type-icon-fa" aria-hidden="true"></i> },
        { id: 'business', name: 'Business', description: 'Professional company website', icon: <i className="fas fa-building type-icon-fa" aria-hidden="true"></i> },
        { id: 'blog', name: 'Blog', description: 'Share your thoughts and articles', icon: <i className="fas fa-blog type-icon-fa" aria-hidden="true"></i> },
        { id: 'news', name: 'News', description: 'Modern newsroom with breaking stories', icon: <i className="fas fa-newspaper type-icon-fa" aria-hidden="true"></i> },
        { id: 'article', name: 'Article', description: 'Long-form editorial or magazine story', icon: <i className="fas fa-scroll type-icon-fa" aria-hidden="true"></i> }
    ])

    const handleTypeSelect = (type) => {
        actions.setWebsiteType(type)
        console.log('Selected:', type)
    }

    if (state.step === 'generator') {
        return (
            <div className="generator-view">
                <button onClick={() => actions.goBack('home')} className="btn btn-secondary back-btn">
                    ?+? Back to Selection
                </button>

                {state.websiteType.id === 'portfolio' && <PortfolioForm />}
                {state.websiteType.id === 'business' && <BusinessForm />}
                {state.websiteType.id === 'blog' && <BlogForm />}
                {state.websiteType.id === 'news' && <NewsForm />}
                {state.websiteType.id === 'article' && <ArticleForm />}
                {state.websiteType.id !== 'portfolio' && state.websiteType.id !== 'business' && state.websiteType.id !== 'blog' && state.websiteType.id !== 'news' && state.websiteType.id !== 'article' && (
                    <div className="coming-soon">
                        <h2>Creating {state.websiteType.name} Website</h2>
                        <p>?? {state.websiteType.name} website form coming soon!</p>
                        <p>For now, try the Portfolio website type.</p>
                    </div>
                )}
            </div>
        )
    }



    return (
        <div className="website-type-selector">
            <div className="selector-header">
                <h2>Choose Your Website Type</h2>
                <p>Select the type of website you want to create</p>
            </div>

            <div className="website-types-grid">
                {websiteTypes.map((type) => (
                    <div
                        key={type.id}
                        className="website-type-card"
                        onClick={() => handleTypeSelect(type)}
                    >
                        <div className="type-icon">{type.icon}</div>
                        <h3>{type.name}</h3>
                        <p>{type.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WebsiteTypeSelector


