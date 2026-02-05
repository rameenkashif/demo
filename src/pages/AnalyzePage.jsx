import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import VideoUploader from '../components/VideoUploader'
import { analyzeVideo } from '../services/edenai'
import { saveVideoAnalysis } from '../services/supabase'
import './AnalyzePage.css'

function AnalyzePage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [selectedPlatform, setSelectedPlatform] = useState('tiktok')
    const [uploadedVideo, setUploadedVideo] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisProgress, setAnalysisProgress] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')

    const platforms = [
        { id: 'tiktok', name: 'TikTok', icon: '🎵' },
        { id: 'reels', name: 'Instagram Reels', icon: '📸' },
        { id: 'shorts', name: 'YouTube Shorts', icon: '▶️' }
    ]

    const handleVideoUpload = (file) => {
        setUploadedVideo(file)
        setErrorMessage('')
    }

    const handleAnalyze = async () => {
        if (!uploadedVideo) {
            setErrorMessage('Please upload a video first')
            return
        }

        setIsAnalyzing(true)
        setAnalysisProgress(10)
        setErrorMessage('')

        try {
            // Simulate AI analysis with mock data
            setAnalysisProgress(20)
            console.log('📤 Simulating AI analysis...')

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1000))
            setAnalysisProgress(50)

            await new Promise(resolve => setTimeout(resolve, 1000))
            setAnalysisProgress(80)

            // Create mock analysis data
            const mockAnalysis = {
                videoTitle: uploadedVideo.name,
                platform: selectedPlatform,
                scores: {
                    hookStrength: 75,
                    retentionRisk: 68,
                    ctaEffectiveness: 82,
                    seoDiscoverability: 71,
                    trendRelevance: 79
                },
                feedback: [
                    {
                        timestamp: '0:00-0:03',
                        severity: 'warning',
                        message: 'Opening could be stronger',
                        suggestion: 'Start with a bold statement or question to hook viewers immediately'
                    },
                    {
                        timestamp: '0:05-0:08',
                        severity: 'info',
                        message: 'Good visual variety',
                        suggestion: 'Continue using dynamic shots to maintain engagement'
                    }
                ],
                hookSuggestions: [
                    {
                        original: 'Current video opening',
                        rewrite: 'Want to know the secret that changed everything?',
                        style: 'question',
                        confidence: 88
                    },
                    {
                        original: 'Current video opening',
                        rewrite: 'This is what nobody tells you about...',
                        style: 'curiosity',
                        confidence: 85
                    }
                ],
                ctaSuggestions: [
                    {
                        timing: 'mid',
                        message: 'Follow for more tips like this',
                        effectiveness: 78
                    }
                ],
                captionOptimization: {
                    current: uploadedVideo.name.replace(/\.[^/.]+$/, ''),
                    optimized: `${selectedPlatform} content that will boost your engagement! 🚀 Click to see the full strategy`,
                    keywords: ['growth', 'viral', 'engagement', selectedPlatform],
                    hashtags: {
                        trending: ['#viral', '#fyp', '#trending'],
                        niche: [`#${selectedPlatform}tips`, '#contentcreator'],
                        branded: ['#pixelcreatorai']
                    }
                },
                summary: 'Strong foundation with room for improvement in the hook and CTA placement.',
                analyzedAt: new Date().toISOString()
            }

            setAnalysisProgress(100)
            console.log('✅ Mock analysis complete!')

            // Save to database if user is logged in
            if (user) {
                await saveVideoAnalysis({
                    firebaseUid: user.uid,
                    videoTitle: uploadedVideo.name,
                    platform: selectedPlatform,
                    analysisData: mockAnalysis
                })
            }

            // Navigate to results
            setTimeout(() => {
                navigate('/results', {
                    state: {
                        analysis: mockAnalysis,
                        videoName: uploadedVideo.name
                    }
                })
            }, 500)

        } catch (error) {
            console.error('Analysis error:', error)
            setErrorMessage(error.message || 'Failed to analyze video. Please try again.')
            setIsAnalyzing(false)
            setAnalysisProgress(0)
        }
    }

    return (
        <div className="analyze-page">
            <div className="analyze-container">
                <div className="analyze-header">
                    <h1 className="analyze-title">
                        Upload & <span className="gradient-text">Analyze</span>
                    </h1>
                    <p className="analyze-subtitle">
                        Get AI-powered insights to level up your content
                    </p>
                </div>

                <div className="analyze-content">
                    <div className="platform-selector">
                        <label className="platform-label">Target Platform</label>
                        <div className="platform-options">
                            {platforms.map(platform => (
                                <button
                                    key={platform.id}
                                    className={`platform-option ${selectedPlatform === platform.id ? 'active' : ''}`}
                                    onClick={() => setSelectedPlatform(platform.id)}
                                    disabled={isAnalyzing}
                                >
                                    <span className="platform-icon">{platform.icon}</span>
                                    <span className="platform-name">{platform.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <VideoUploader
                        onUpload={handleVideoUpload}
                        disabled={isAnalyzing}
                    />

                    {errorMessage && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {errorMessage}
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="analysis-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${analysisProgress}%` }}
                                />
                            </div>
                            <p className="progress-text">
                                {analysisProgress < 30 && '🎬 Preparing video...'}
                                {analysisProgress >= 30 && analysisProgress < 70 && '🤖 AI analyzing content...'}
                                {analysisProgress >= 70 && analysisProgress < 100 && '💾 Saving results...'}
                                {analysisProgress === 100 && '✅ Complete!'}
                            </p>
                        </div>
                    )}

                    <div className="analyze-actions">
                        <button
                            className="analyze-btn"
                            onClick={handleAnalyze}
                            disabled={!uploadedVideo || isAnalyzing}
                        >
                            {isAnalyzing ? '⏳ Analyzing...' : '🚀 Analyze Video'}
                        </button>
                    </div>

                    <div className="feature-tags">
                        <span className="feature-tag">✨ AI-Powered</span>
                        <span className="feature-tag">⚡ Real-time Analysis</span>
                        <span className="feature-tag">🎯 Actionable Insights</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalyzePage
