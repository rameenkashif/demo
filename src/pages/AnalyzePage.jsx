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
            // Progress: Preparing video
            setAnalysisProgress(20)
            console.log('📤 Preparing video for AI analysis...')

            // Progress: Analyzing with Eden AI
            setAnalysisProgress(40)
            const aiResult = await analyzeVideo(uploadedVideo, selectedPlatform)

            if (!aiResult.success) {
                throw new Error(aiResult.error || 'AI analysis failed')
            }

            // Progress: Processing results
            setAnalysisProgress(70)
            console.log('💾 Saving analysis to database...')

            // Save to Supabase if user is logged in
            if (user) {
                const saveResult = await saveVideoAnalysis({
                    firebaseUid: user.uid,
                    videoTitle: uploadedVideo.name,
                    platform: selectedPlatform,
                    analysisData: aiResult.data
                })

                if (!saveResult.success) {
                    console.warn('Failed to save to database:', saveResult.error)
                }
            }

            // Progress: Complete
            setAnalysisProgress(100)
            console.log('✅ Analysis complete!')

            // Navigate to results with the analysis data
            setTimeout(() => {
                navigate('/results', {
                    state: {
                        analysis: aiResult.data,
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
