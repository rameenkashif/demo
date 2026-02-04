import { Link } from 'react-router-dom'
import PixelButton from '../components/PixelButton'
import PixelCard from '../components/PixelCard'
import './HomePage.css'

function HomePage() {
    const features = [
        {
            icon: "🎯",
            title: "AI Video Scoring",
            description: "Get instant scores on hooks, retention, CTAs, SEO, and trend alignment"
        },
        {
            icon: "⏱️",
            title: "Timestamped Feedback",
            description: "Know exactly where your video loses viewers and how to fix it"
        },
        {
            icon: "✨",
            title: "Hook Rewrites",
            description: "AI-generated hook alternatives that stop the scroll"
        },
        {
            icon: "📈",
            title: "SEO Optimization",
            description: "Caption rewrites and hashtag clusters for maximum discoverability"
        },
        {
            icon: "🔥",
            title: "Trend Intelligence",
            description: "Know which trends to jump on and when they'll peak"
        },
        {
            icon: "📊",
            title: "Track Progress",
            description: "Watch your creator skills level up over time"
        }
    ]

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        <span>AI-Powered Creator Tools</span>
                    </div>

                    <h1 className="hero-title">
                        Level Up Your
                        <span className="text-gradient"> Content Game</span>
                    </h1>

                    <p className="hero-subtitle">
                        Upload your video. Get clear, actionable feedback.
                        <br />
                        Know exactly what to fix before you post.
                    </p>

                    <div className="hero-actions">
                        <Link to="/analyze">
                            <PixelButton size="large">
                                Analyze Your Video
                            </PixelButton>
                        </Link>
                        <Link to="/analyze">
                            <PixelButton variant="ghost" size="large">
                                See Demo
                            </PixelButton>
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-value">10K+</span>
                            <span className="stat-label">Videos Analyzed</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-value">85%</span>
                            <span className="stat-label">Avg. Score Improvement</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-value">2.4x</span>
                            <span className="stat-label">More Views</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="visual-card">
                        <div className="visual-header">
                            <div className="visual-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span className="visual-title">Video Analysis</span>
                        </div>
                        <div className="visual-content">
                            <div className="visual-score">
                                <span className="score-label">Hook Strength</span>
                                <div className="score-bar">
                                    <div className="score-fill" style={{ width: '85%' }}></div>
                                </div>
                                <span className="score-value">85</span>
                            </div>
                            <div className="visual-score">
                                <span className="score-label">Retention</span>
                                <div className="score-bar">
                                    <div className="score-fill good" style={{ width: '72%' }}></div>
                                </div>
                                <span className="score-value">72</span>
                            </div>
                            <div className="visual-score">
                                <span className="score-label">CTA Power</span>
                                <div className="score-bar">
                                    <div className="score-fill warning" style={{ width: '58%' }}></div>
                                </div>
                                <span className="score-value">58</span>
                            </div>
                        </div>
                        <div className="visual-suggestion">
                            💡 "Add a pattern interrupt at 0:08 to boost retention"
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="features-header">
                    <h2>Everything You Need to<br /><span className="text-gradient">Create Better Content</span></h2>
                    <p>Powerful AI tools designed specifically for short-form creators</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <PixelCard key={index} className="feature-card" glow>
                            <span className="feature-icon">{feature.icon}</span>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </PixelCard>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <PixelCard variant="accent" glow className="cta-card">
                    <div className="cta-content">
                        <h2>Ready to Level Up?</h2>
                        <p>Start analyzing your videos and get AI-powered feedback in seconds.</p>
                        <Link to="/analyze">
                            <PixelButton variant="secondary" size="large">
                                Get Started Free
                            </PixelButton>
                        </Link>
                    </div>
                    <div className="cta-pixels">
                        <span className="float-pixel p1"></span>
                        <span className="float-pixel p2"></span>
                        <span className="float-pixel p3"></span>
                        <span className="float-pixel p4"></span>
                    </div>
                </PixelCard>
            </section>
        </div>
    )
}

export default HomePage
