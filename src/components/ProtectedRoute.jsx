import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-content">
                    <div className="loading-pixels">
                        <span className="load-pixel"></span>
                        <span className="load-pixel"></span>
                        <span className="load-pixel"></span>
                        <span className="load-pixel"></span>
                    </div>
                    <p>Loading...</p>
                </div>
                <style>{`
          .loading-screen {
            min-height: calc(100vh - 80px);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .loading-pixels {
            display: grid;
            grid-template-columns: repeat(2, 16px);
            gap: 4px;
          }
          .load-pixel {
            width: 16px;
            height: 16px;
            border-radius: 2px;
            animation: loadPulse 1s ease-in-out infinite;
          }
          .load-pixel:nth-child(1) { background: #00f5d4; animation-delay: 0s; }
          .load-pixel:nth-child(2) { background: #f15bb5; animation-delay: 0.2s; }
          .load-pixel:nth-child(3) { background: #9b5de5; animation-delay: 0.3s; }
          .load-pixel:nth-child(4) { background: #fee440; animation-delay: 0.1s; }
          @keyframes loadPulse {
            0%, 100% { opacity: 0.3; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          .loading-content p {
            font-family: 'Press Start 2P', cursive;
            font-size: 0.625rem;
            color: #a0a0b0;
          }
        `}</style>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
