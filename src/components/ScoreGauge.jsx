import { useEffect, useState } from 'react'
import './ScoreGauge.css'

function ScoreGauge({
    score,
    label,
    icon,
    description,
    size = 'medium'
}) {
    const [animatedScore, setAnimatedScore] = useState(0)

    useEffect(() => {
        // Animate score counting up
        const duration = 1000
        const steps = 60
        const increment = score / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= score) {
                setAnimatedScore(score)
                clearInterval(timer)
            } else {
                setAnimatedScore(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [score])

    const getScoreColor = (value) => {
        if (value >= 80) return 'excellent'
        if (value >= 60) return 'good'
        if (value >= 40) return 'average'
        if (value >= 20) return 'poor'
        return 'critical'
    }

    const getScoreLabel = (value) => {
        if (value >= 80) return 'Excellent'
        if (value >= 60) return 'Good'
        if (value >= 40) return 'Needs Work'
        if (value >= 20) return 'Poor'
        return 'Critical'
    }

    const colorClass = getScoreColor(score)
    const circumference = 2 * Math.PI * 45
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference

    return (
        <div className={`score-gauge ${size} ${colorClass}`}>
            <div className="gauge-circle">
                <svg viewBox="0 0 100 100" className="gauge-svg">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="gauge-bg"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="gauge-progress"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        }}
                    />
                </svg>
                <div className="gauge-content">
                    {icon && <span className="gauge-icon">{icon}</span>}
                    <span className="gauge-score">{animatedScore}</span>
                </div>
            </div>
            <div className="gauge-info">
                <h4 className="gauge-label">{label}</h4>
                <span className={`gauge-status ${colorClass}`}>{getScoreLabel(score)}</span>
                {description && <p className="gauge-description">{description}</p>}
            </div>
        </div>
    )
}

export default ScoreGauge
