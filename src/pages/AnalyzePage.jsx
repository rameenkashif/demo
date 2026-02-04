import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VideoUploader from '../components/VideoUploader'
import PixelButton from '../components/PixelButton'
import './AnalyzePage.css'

function AnalyzePage() {
    const [uploadedFile, setUploadedFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState('tiktok')
    const navigate = useNavigate()

    const platforms = [
        { id: 'tiktok', name: 'TikTok', icon: '📱' },
        { id: 'reels', name: 'Reels', icon: '📸' },
        { id: 'shorts', name: 'Shorts', icon: '▶️' }
    ]

    const handleUpload = (file) => {
        setUploadedFile(file)
    }

    const handleAnalyze = () => {
        if (!uploadedFile) return

        setIsProcessing(true)

        // Simulate AI processing time
        setTimeout(() => {
            navigate('/results')
        }, 3000)
    }

    return (
        <div className="analyze-page">
            <div className="analyze-container">
                <header className="analyze-header">
                    <h1>Analyze Your Video</h1>
                    <p>Upload your short-form video and get AI-powered feedback in seconds</p>
                </header>

                <div className="analyze-content">
                    <div className="upload-section">
                        <VideoUploader
                            onUpload={handleUpload}
                            isProcessing={isProcessing}
                        />
                    </div>

                    {uploadedFile && !isProcessing && (
                        <div className="options-section animate-slideUp">
                            <div className="platform-selector">
                                <h3>Select Platform</h3>
                                <div className="platform-options">
                                    {platforms.map(platform => (
                                        <button
                                            key={platform.id}
                                            className={`platform-option ${selectedPlatform === platform.id ? 'active' : ''}`}
                                            onClick={() => setSelectedPlatform(platform.id)}
                                        >
                                            <span className="platform-icon">{platform.icon}</span>
                                            <span className="platform-name">{platform.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="analyze-action">
                                <PixelButton
                                    size="large"
                                    fullWidth
                                    onClick={handleAnalyze}
                                >
                                    ⚡ Analyze Now
                                </PixelButton>
                                <p className="analyze-hint">
                                    AI will score hooks, retention, CTAs, SEO, and trends
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="analyze-features">
                    <div className="feature-tag">
                        <span className="tag-icon">🎯</span>
                        <span>Hook Analysis</span>
                    </div>
                    <div className="feature-tag">
                        <span className="tag-icon">📊</span>
                        <span>Retention Mapping</span>
                    </div>
                    <div className="feature-tag">
                        <span className="tag-icon">✨</span>
                        <span>AI Suggestions</span>
                    </div>
                    <div className="feature-tag">
                        <span className="tag-icon">🔍</span>
                        <span>SEO Optimization</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalyzePage
