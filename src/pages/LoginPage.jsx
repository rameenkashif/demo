import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PixelCard from '../components/PixelCard'
import './LoginPage.css'

function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Simulate Google OAuth flow for demo
            // In production, this would use Firebase Auth or similar
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Store demo user in localStorage
            const demoUser = {
                id: 'demo_user_123',
                name: 'Demo Creator',
                email: 'demo@pixelcreator.ai',
                avatar: null,
                createdAt: new Date().toISOString()
            }
            localStorage.setItem('pixelai_user', JSON.stringify(demoUser))

            // Navigate to analyze page
            navigate('/analyze')
        } catch (err) {
            setError('Sign in failed. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Decorative pixels */}
                <div className="login-pixels">
                    <span className="deco-pixel p1"></span>
                    <span className="deco-pixel p2"></span>
                    <span className="deco-pixel p3"></span>
                    <span className="deco-pixel p4"></span>
                </div>

                <PixelCard glow className="login-card">
                    {/* Logo */}
                    <div className="login-logo">
                        <div className="logo-pixels">
                            <span className="pixel"></span>
                            <span className="pixel"></span>
                            <span className="pixel"></span>
                            <span className="pixel"></span>
                        </div>
                        <span className="logo-text">Pixel<span className="accent">AI</span></span>
                    </div>

                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to start analyzing your content</p>

                    {/* Google Sign In Button */}
                    <button
                        className={`google-signin-btn ${isLoading ? 'loading' : ''}`}
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="btn-loader">
                                <span className="loader-dot"></span>
                                <span className="loader-dot"></span>
                                <span className="loader-dot"></span>
                            </div>
                        ) : (
                            <>
                                <svg className="google-icon" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <p className="login-error">{error}</p>
                    )}

                    {/* Divider */}
                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    {/* Demo Mode */}
                    <button
                        className="demo-btn"
                        onClick={() => navigate('/analyze')}
                    >
                        <span className="demo-icon">▶</span>
                        <span>Try Demo Mode</span>
                    </button>

                    <p className="login-terms">
                        By signing in, you agree to our
                        <a href="#"> Terms of Service</a> and
                        <a href="#"> Privacy Policy</a>
                    </p>
                </PixelCard>

                {/* Features reminder */}
                <div className="login-features">
                    <div className="feature">
                        <span className="feature-icon">🎯</span>
                        <span>AI Video Scoring</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">✨</span>
                        <span>Hook Rewrites</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">📈</span>
                        <span>Trend Insights</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
