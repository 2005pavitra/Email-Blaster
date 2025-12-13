import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StudentView from './StudentView';
import Admin from './Admin.jsx';

// Basic password protection component
const ProtectedAdmin = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Password');
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{ padding: '40px', maxWidth: '300px', margin: 'auto', textAlign: 'center' }}>
                <h2>Admin Access</h2>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
                />
                <button
                    onClick={handleLogin}
                    style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Unlock
                </button>
            </div>
        );
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>🏠 Student View</Link>
                <Link to="/admin" style={{ textDecoration: 'none', fontWeight: 'bold' }}>🔑 Admin Panel</Link>
            </nav>

            <Routes>
                <Route path="/" element={<StudentView />} />
                <Route path="/admin" element={
                    <ProtectedAdmin>
                        <Admin />
                    </ProtectedAdmin>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;