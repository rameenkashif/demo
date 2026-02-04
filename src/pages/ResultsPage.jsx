import { useState } from 'react'
import { Link } from 'react-router-dom'
import PixelCard from '../components/PixelCard'
import PixelButton from '../components/PixelButton'
import ScoreGauge from '../components/ScoreGauge'
import { mockAnalysisResults, scoreDescriptions, scoreIcons } from '../data/mockAnalysis'
import './ResultsPage.css'

function ResultsPage() {
    const [activeTab, setActiveTab] = useState('scores')
    const [copiedIndex, setCopiedIndex] = useState(null)

    const { scores, timestampedFeedback, hookSuggestions, ctaSuggestions, captionSuggestions, hashtagClusters } = mockAnalysisResults

    const tabs = [
        { id: 'scores', label: 'Scores', icon: '📊' },
        { id: 'feedback', label: 'Feedback', icon: '💡' },
        { id: 'hooks', label: 'Hooks', icon: '🎣' },
        { id: 'captions', label: 'Captions', icon: '✏️' }
    ]

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'error': return 'severity-error'
            case 'warning': return 'severity-warning'
            case 'info': return 'severity-info'
            default: return ''
        }
    }

    return (
        <div className="results-page">
            <header className="results-header">
                <div className="header-content">
                    <Link to="/analyze" className="back-link">← Back to Upload</Link>
                    <h1>Video Analysis Results</h1>
                    <p className="video-title">{mockAnalysisResults.videoTitle}</p>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="results-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </nav>

            <div className="results-content">
                {/* Scores Tab */}
                {activeTab === 'scores' && (
                    <section className="scores-section animate-fadeIn">
                        <div className="scores-grid">
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={scores.hookStrength}
                                    label="Hook Strength"
                                    icon={scoreIcons.hookStrength}
                                    description={scoreDescriptions.hookStrength}
                                    size="large"
                                />
                            </PixelCard>
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={100 - scores.retentionRisk}
                                    label="Retention Score"
                                    icon={scoreIcons.retentionRisk}
                                    description="Higher means better viewer retention"
                                    size="large"
                                />
                            </PixelCard>
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={scores.ctaEffectiveness}
                                    label="CTA Power"
                                    icon={scoreIcons.ctaEffectiveness}
                                    description={scoreDescriptions.ctaEffectiveness}
                                    size="large"
                                />
                            </PixelCard>
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={scores.seoDiscoverability}
                                    label="SEO Score"
                                    icon={scoreIcons.seoDiscoverability}
                                    description={scoreDescriptions.seoDiscoverability}
                                    size="large"
                                />
                            </PixelCard>
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={scores.trendRelevance}
                                    label="Trend Fit"
                                    icon={scoreIcons.trendRelevance}
                                    description={scoreDescriptions.trendRelevance}
                                    size="large"
                                />
                            </PixelCard>
                        </div>

                        <PixelCard className="overall-summary">
                            <h3>📈 Overall Assessment</h3>
                            <p>
                                Your video has strong SEO potential but could benefit from a sharper hook
                                and clearer CTAs. Focus on improving the opening 3 seconds and adding
                                mid-video engagement prompts.
                            </p>
                        </PixelCard>
                    </section>
                )}

                {/* Feedback Tab */}
                {activeTab === 'feedback' && (
                    <section className="feedback-section animate-fadeIn">
                        <h2 className="section-title">Timestamped Feedback</h2>
                        <div className="feedback-timeline">
                            {timestampedFeedback.map((item, index) => (
                                <PixelCard key={index} className={`feedback-item ${getSeverityClass(item.severity)}`}>
                                    <div className="feedback-header">
                                        <span className="feedback-time">{item.time}</span>
                                        <span className={`feedback-badge ${item.type}`}>{item.type}</span>
                                    </div>
                                    <h4 className="feedback-title">{item.title}</h4>
                                    <p className="feedback-text">{item.feedback}</p>
                                    {item.suggestion && (
                                        <div className="feedback-suggestion">
                                            <span className="suggestion-label">💡 Suggestion:</span>
                                            <p>{item.suggestion}</p>
                                        </div>
                                    )}
                                </PixelCard>
                            ))}
                        </div>
                    </section>
                )}

                {/* Hooks Tab */}
                {activeTab === 'hooks' && (
                    <section className="hooks-section animate-fadeIn">
                        <h2 className="section-title">AI-Generated Hook Alternatives</h2>
                        <p className="section-subtitle">Click any hook to copy it to clipboard</p>

                        <div className="hooks-list">
                            {hookSuggestions.map((hook, index) => (
                                <PixelCard
                                    key={index}
                                    className="hook-item"
                                    onClick={() => copyToClipboard(hook.text, index)}
                                >
                                    <div className="hook-header">
                                        <span className={`hook-style ${hook.style}`}>{hook.style}</span>
                                        <span className="hook-confidence">{hook.confidence}% match</span>
                                    </div>
                                    <p className="hook-text">"{hook.text}"</p>
                                    <span className="copy-indicator">
                                        {copiedIndex === index ? '✓ Copied!' : 'Click to copy'}
                                    </span>
                                </PixelCard>
                            ))}
                        </div>

                        <div className="cta-suggestions">
                            <h3>Recommended CTAs</h3>
                            <div className="cta-list">
                                {ctaSuggestions.map((cta, index) => (
                                    <PixelCard key={index} className="cta-item">
                                        <div className="cta-header">
                                            <span className="cta-placement">{cta.placement}-video</span>
                                            <span className="cta-purpose">{cta.purpose}</span>
                                        </div>
                                        <p className="cta-text">"{cta.text}"</p>
                                    </PixelCard>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Captions Tab */}
                {activeTab === 'captions' && (
                    <section className="captions-section animate-fadeIn">
                        <h2 className="section-title">Caption & SEO Optimization</h2>

                        <div className="caption-comparison">
                            <PixelCard className="caption-card original">
                                <h4>Original Caption</h4>
                                <p>{captionSuggestions.original}</p>
                            </PixelCard>

                            <div className="caption-arrow">→</div>

                            <PixelCard className="caption-card optimized" glow>
                                <h4>Optimized Caption</h4>
                                <p>{captionSuggestions.optimized}</p>
                                <button
                                    className="copy-button"
                                    onClick={() => copyToClipboard(captionSuggestions.optimized, 'caption')}
                                >
                                    {copiedIndex === 'caption' ? '✓ Copied!' : 'Copy'}
                                </button>
                            </PixelCard>
                        </div>

                        <div className="keywords-section">
                            <h3>Target Keywords</h3>
                            <div className="keywords-list">
                                {captionSuggestions.keywords.map((keyword, index) => (
                                    <span key={index} className="keyword-tag">{keyword}</span>
                                ))}
                            </div>
                        </div>

                        <div className="hashtags-section">
                            <h3>Hashtag Clusters</h3>
                            <div className="hashtag-clusters">
                                {hashtagClusters.map((cluster, index) => (
                                    <PixelCard key={index} className="hashtag-cluster">
                                        <div className="cluster-header">
                                            <span className="cluster-name">{cluster.name}</span>
                                            <span className={`cluster-reach ${cluster.reach}`}>{cluster.reach} reach</span>
                                        </div>
                                        <div className="cluster-tags">
                                            {cluster.tags.map((tag, i) => (
                                                <span key={i} className="hashtag">{tag}</span>
                                            ))}
                                        </div>
                                    </PixelCard>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Bottom Action */}
            <div className="results-actions">
                <Link to="/analyze">
                    <PixelButton variant="ghost">Analyze Another Video</PixelButton>
                </Link>
                <PixelButton variant="secondary">Export Report</PixelButton>
            </div>
        </div>
    )
}

export default ResultsPage
