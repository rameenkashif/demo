import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PixelCard from '../components/PixelCard'
import PixelButton from '../components/PixelButton'
import ScoreGauge from '../components/ScoreGauge'
import { mockAnalysisResults, scoreDescriptions, scoreIcons } from '../data/mockAnalysis'
import './ResultsPage.css'

function ResultsPage() {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('scores')
    const [copiedIndex, setCopiedIndex] = useState(null)

    // Use real AI data if provided, otherwise fallback to mock
    const analysisData = location.state?.analysis || mockAnalysisResults
    const videoName = location.state?.videoName || 'Video Analysis'

    const { scores, feedback, hookSuggestions, ctaSuggestions, captionOptimization, summary } = analysisData

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
                    <p className="video-title">{videoName}</p>
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
                                    score={scores.hookStrength || 0}
                                    label="Hook Strength"
                                    icon={scoreIcons.hookStrength}
                                    description={scoreDescriptions.hookStrength}
                                    size="large"
                                />
                            </PixelCard>
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={scores.retentionRisk || 0}
                                    label="Retention Score"
                                    icon={scoreIcons.retentionRisk}
                                    description="Higher means better viewer retention"
                                    size="large"
                                />
                            </PixelCard>
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={scores.ctaEffectiveness || 0}
                                    label="CTA Power"
                                    icon={scoreIcons.ctaEffectiveness}
                                    description={scoreDescriptions.ctaEffectiveness}
                                    size="large"
                                />
                            </PixelCard>
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={scores.seoDiscoverability || 0}
                                    label="SEO Score"
                                    icon={scoreIcons.seoDiscoverability}
                                    description={scoreDescriptions.seoDiscoverability}
                                    size="large"
                                />
                            </PixelCard>
                            <PixelCard glow className="score-card">
                                <ScoreGauge
                                    score={scores.trendRelevance || 0}
                                    label="Trend Fit"
                                    icon={scoreIcons.trendRelevance}
                                    description={scoreDescriptions.trendRelevance}
                                    size="large"
                                />
                            </PixelCard>
                        </div>

                        {summary && (
                            <PixelCard className="overall-summary">
                                <h3>📈 AI Summary</h3>
                                <p>{summary}</p>
                            </PixelCard>
                        )}
                    </section>
                )}

                {/* Feedback Tab */}
                {activeTab === 'feedback' && (
                    <section className="feedback-section animate-fadeIn">
                        <h2 className="section-title">Timestamped Feedback</h2>
                        <div className="feedback-timeline">
                            {feedback && feedback.length > 0 ? (
                                feedback.map((item, index) => (
                                    <PixelCard key={index} className={`feedback-item ${getSeverityClass(item.severity)}`}>
                                        <div className="feedback-header">
                                            <span className="feedback-time">{item.timestamp}</span>
                                            <span className={`feedback-badge ${item.severity}`}>{item.severity}</span>
                                        </div>
                                        <h4 className="feedback-title">{item.message}</h4>
                                        {item.suggestion && (
                                            <div className="feedback-suggestion">
                                                <span className="suggestion-label">💡 Suggestion:</span>
                                                <p>{item.suggestion}</p>
                                            </div>
                                        )}
                                    </PixelCard>
                                ))
                            ) : (
                                <PixelCard>
                                    <p>No specific feedback available for this video.</p>
                                </PixelCard>
                            )}
                        </div>
                    </section>
                )}

                {/* Hooks Tab */}
                {activeTab === 'hooks' && (
                    <section className="hooks-section animate-fadeIn">
                        <h2 className="section-title">AI-Generated Hook Alternatives</h2>
                        <p className="section-subtitle">Click any hook to copy it to clipboard</p>

                        <div className="hooks-list">
                            {hookSuggestions && hookSuggestions.length > 0 ? (
                                hookSuggestions.map((hook, index) => (
                                    <PixelCard
                                        key={index}
                                        className="hook-item"
                                        onClick={() => copyToClipboard(hook.rewrite || hook.text, index)}
                                    >
                                        <div className="hook-header">
                                            <span className={`hook-style ${hook.style}`}>{hook.style}</span>
                                            <span className="hook-confidence">{hook.confidence || 85}% match</span>
                                        </div>
                                        <p className="hook-text">"{hook.rewrite || hook.text}"</p>
                                        <span className="copy-indicator">
                                            {copiedIndex === index ? '✓ Copied!' : 'Click to copy'}
                                        </span>
                                    </PixelCard>
                                ))
                            ) : (
                                <PixelCard>
                                    <p>No hook suggestions available for this video.</p>
                                </PixelCard>
                            )}
                        </div>

                        {ctaSuggestions && ctaSuggestions.length > 0 && (
                            <div className="cta-suggestions">
                                <h3>Recommended CTAs</h3>
                                <div className="cta-list">
                                    {ctaSuggestions.map((cta, index) => (
                                        <PixelCard key={index} className="cta-item">
                                            <div className="cta-header">
                                                <span className="cta-placement">{cta.timing || cta.placement}</span>
                                                <span className="cta-purpose">{cta.effectiveness || cta.purpose}%</span>
                                            </div>
                                            <p className="cta-text">"{cta.message || cta.text}"</p>
                                        </PixelCard>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Captions Tab */}
                {activeTab === 'captions' && (
                    <section className="captions-section animate-fadeIn">
                        <h2 className="section-title">Caption & SEO Optimization</h2>

                        {captionOptimization && (
                            <>
                                <div className="caption-comparison">
                                    <PixelCard className="caption-card original">
                                        <h4>Original Caption</h4>
                                        <p>{captionOptimization.current || 'No caption detected'}</p>
                                    </PixelCard>

                                    <div className="caption-arrow">→</div>

                                    <PixelCard className="caption-card optimized" glow>
                                        <h4>Optimized Caption</h4>
                                        <p>{captionOptimization.optimized}</p>
                                        <button
                                            className="copy-button"
                                            onClick={() => copyToClipboard(captionOptimization.optimized, 'caption')}
                                        >
                                            {copiedIndex === 'caption' ? '✓ Copied!' : 'Copy'}
                                        </button>
                                    </PixelCard>
                                </div>

                                {captionOptimization.keywords && captionOptimization.keywords.length > 0 && (
                                    <div className="keywords-section">
                                        <h3>Target Keywords</h3>
                                        <div className="keywords-list">
                                            {captionOptimization.keywords.map((keyword, index) => (
                                                <span key={index} className="keyword-tag">{keyword}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {captionOptimization.hashtags && (
                                    <div className="hashtags-section">
                                        <h3>Hashtag Clusters</h3>
                                        <div className="hashtag-clusters">
                                            {Object.entries(captionOptimization.hashtags).map(([key, tags], index) => (
                                                tags.length > 0 && (
                                                    <PixelCard key={index} className="hashtag-cluster">
                                                        <div className="cluster-header">
                                                            <span className="cluster-name">{key}</span>
                                                        </div>
                                                        <div className="cluster-tags">
                                                            {tags.map((tag, i) => (
                                                                <span key={i} className="hashtag">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </PixelCard>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                )}
            </div>

            {/* Bottom Action */}
            <div className="results-actions">
                <Link to="/analyze">
                    <PixelButton variant="ghost">Analyze Another Video</PixelButton>
                </Link>
            </div>
        </div>
    )
}

export default ResultsPage
