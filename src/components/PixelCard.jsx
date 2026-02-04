import './PixelCard.css'

function PixelCard({
    children,
    variant = 'default',
    glow = false,
    hover = true,
    className = '',
    onClick
}) {
    return (
        <div
            className={`pixel-card ${variant} ${glow ? 'glow' : ''} ${hover ? 'hoverable' : ''} ${className}`}
            onClick={onClick}
        >
            <div className="card-border"></div>
            <div className="card-content">
                {children}
            </div>
        </div>
    )
}

export default PixelCard
