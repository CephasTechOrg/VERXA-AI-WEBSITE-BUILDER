import React, { useEffect, useMemo, useState } from 'react'

const defaultSteps = [
    'Processing your data',
    'Generating content',
    'Creating design',
    'Finalizing website'
]

const GenerationProgress = ({
    title = 'AI is generating your website...',
    description = "This may take up to 2 minutes. Please keep this tab open.",
    steps = defaultSteps,
    cycleDelay = 2500
}) => {
    const normalizedSteps = useMemo(() => (steps && steps.length ? steps : defaultSteps), [steps])
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        setActiveIndex(0)
    }, [normalizedSteps])

    useEffect(() => {
        if (normalizedSteps.length <= 1) return
        const interval = setInterval(() => {
            setActiveIndex(prev => {
                if (prev >= normalizedSteps.length - 1) {
                    clearInterval(interval)
                    return prev
                }
                return prev + 1
            })
        }, cycleDelay)
        return () => clearInterval(interval)
    }, [normalizedSteps, cycleDelay])

    const progressPercent = normalizedSteps.length
        ? ((activeIndex + 1) / normalizedSteps.length) * 100
        : 0

    return (
        <div className="generation-overlay">
            <div className="generation-loading">
                <div className="loading-content">
                    <div className="ai-loader">
                        <div className="ai-bubble ai-bubble-1"></div>
                        <div className="ai-bubble ai-bubble-2"></div>
                        <div className="ai-bubble ai-bubble-3"></div>
                    </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="loading-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="loading-steps">
                        {normalizedSteps.map((step, index) => (
                            <span
                                key={step}
                                className={`step ${index <= activeIndex ? 'active' : ''}`}
                            >
                                {step}
                            </span>
                        ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default GenerationProgress
