import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        const result = await logout()
        if (result.success) {
            navigate('/login')
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <span className="pixel p1"></span>
                        <span className="pixel p2"></span>
                        <span className="pixel p3"></span>
                        <span className="pixel p4"></span>
                    </div>
                    <span className="brand-text">Pixel<span className="accent">AI</span></span>
                </Link>

                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/analyze"
                        className={`nav-link ${location.pathname === '/analyze' ? 'active' : ''}`}
                    >
                        Analyze
                    </Link>
                </div>

                <div className="navbar-actions">
                    {user ? (
                        <div className="user-profile">
                            {user.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    className="user-avatar"
                                />
                            )}
                            <span className="user-name">{user.displayName || user.email}</span>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-cta">
                            <span className="cta-icon">▶</span>
                            Start Free
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
