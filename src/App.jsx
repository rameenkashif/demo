import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import ResultsPage from './pages/ResultsPage'
import './App.css'

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/analyze" element={<AnalyzePage />} />
                        <Route path="/results" element={<ResultsPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
