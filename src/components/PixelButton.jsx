import './PixelButton.css'

function PixelButton({
    children,
    variant = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
    fullWidth = false,
    icon,
    className = ''
}) {
    return (
        <button
            className={`pixel-button ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="button-icon">{icon}</span>}
            <span className="button-text">{children}</span>
            <span className="button-shine"></span>
        </button>
    )
}

export default PixelButton
