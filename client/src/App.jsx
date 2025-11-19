import React from 'react'
import { AppProvider, useApp } from './contexts/AppContext'
import WebsiteTypeSelector from './components/WebsiteTypeSelector'
import PortfolioForm from './components/forms/PortfolioForm'
import BusinessForm from './components/forms/BusinessForm'
import BlogForm from './components/forms/BlogForm'
import NewsForm from './components/forms/NewsForm'
import ArticleForm from './components/forms/ArticleForm'
import EventForm from './components/forms/EventForm'
import Preview from './components/Preview/Preview'
import './App.css'

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    )
}

function AppContent() {
    const { state, actions } = useApp()

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <img src="/logo.png" alt="VERXA AI Logo" className="logo" />
                    <div>
                        <h1>VERXA AI</h1>
                        <p>Create beautiful websites instantly with AI</p>
                    </div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    {state.step === 'home' && <WebsiteTypeSelector />}

                    {state.step === 'generator' && (
                        <div className="generator-view">
                            <button
                                onClick={() => actions.goBack('home')}
                                className="btn btn-secondary back-btn"
                            >
                                Back to Selection
                            </button>
                            {state.websiteType?.id === 'portfolio' && <PortfolioForm />}
                            {state.websiteType?.id === 'business' && <BusinessForm />}
                            {state.websiteType?.id === 'blog' && <BlogForm />}
                            {state.websiteType?.id === 'news' && <NewsForm />}
                            {state.websiteType?.id === 'event' && <EventForm />}
                            {state.websiteType?.id === 'article' && <ArticleForm />}
                            {state.websiteType && !['portfolio', 'business', 'blog', 'news', 'event', 'article'].includes(state.websiteType.id) && (
                                <div className="coming-soon">
                                    <h2>Creating {state.websiteType?.name} Website</h2>
                                    <p>🚧 {state.websiteType?.name} website form coming soon!</p>
                                    <p>For now, try the Portfolio website type.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {state.step === 'preview' && <Preview />}
                </div>
            </main>
        </div>
    )
}

export default App






