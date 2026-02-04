import { useState, useRef } from 'react'
import './VideoUploader.css'

function VideoUploader({ onUpload, isProcessing }) {
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFile = e.dataTransfer.files[0]
        handleFile(droppedFile)
    }

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0]
        handleFile(selectedFile)
    }

    const handleFile = (file) => {
        if (!file) return

        const validTypes = ['video/mp4', 'video/quicktime', 'video/mov']
        if (!validTypes.includes(file.type)) {
            alert('Please upload an MP4 or MOV file')
            return
        }

        setFile(file)

        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreview(url)

        // Notify parent
        if (onUpload) {
            onUpload(file)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const clearFile = () => {
        setFile(null)
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    if (isProcessing) {
        return (
            <div className="uploader-processing">
                <div className="processing-animation">
                    <div className="pixel-grid">
                        {[...Array(9)].map((_, i) => (
                            <span key={i} className="processing-pixel" style={{ animationDelay: `${i * 0.1}s` }}></span>
                        ))}
                    </div>
                </div>
                <h3 className="processing-title">Analyzing Your Video</h3>
                <p className="processing-status">AI is scanning hooks, pacing, and engagement patterns...</p>
            </div>
        )
    }

    if (file && preview) {
        return (
            <div className="uploader-preview">
                <video
                    src={preview}
                    className="preview-video"
                    controls
                    muted
                />
                <div className="preview-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <button className="clear-button" onClick={clearFile}>
                    ✕ Choose Different Video
                </button>
            </div>
        )
    }

    return (
        <div
            className={`video-uploader ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/mov"
                onChange={handleFileSelect}
                className="file-input"
            />

            <div className="upload-icon">
                <div className="icon-pixels">
                    <span className="up-pixel p1"></span>
                    <span className="up-pixel p2"></span>
                    <span className="up-pixel p3"></span>
                    <span className="up-pixel p4"></span>
                    <span className="up-pixel p5"></span>
                </div>
                <span className="upload-arrow">↑</span>
            </div>

            <h3 className="upload-title">Drop your video here</h3>
            <p className="upload-subtitle">or click to browse</p>

            <div className="upload-formats">
                <span className="format-badge">MP4</span>
                <span className="format-badge">MOV</span>
            </div>
        </div>
    )
}

export default VideoUploader
