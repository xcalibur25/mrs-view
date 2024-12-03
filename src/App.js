import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log('Username: ',username)
          console.log('Password: ',password)
            const response = await axios.post('https://52.3.18.150:5002/login', { username, password });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/search';
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <Link to="/register">Register</Link>
        </form>
    );
}

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://52.3.18.150:5002/register', { username, password });
            alert('Registration successful');
            window.location.href = '/';
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
            <Link to="/">Login</Link>
        </form>
    );
}

function Search() {
    const [movie, setMovie] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            console.log('token===>', token)
            const response = await axios.post('https://52.3.18.150:5002/recommend', { movie }, {
                headers: { Authorization: token },
            });
            console.log(response.data);
            setRecommendations(response.data);
        } catch (err) {
            alert('Error searching movies');
        }
    };

    return (
        <div>
            
            <form onSubmit={handleSearch} style={{ maxWidth: '300px', margin: '0 auto' }}>
            <h2> Movie Recommendation</h2>
                <input
                    type="text"
                    placeholder="Enter a movie title"
                    onChange={(e) => setMovie(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>
            <div className="recommendations">
                {recommendations.map((rec, index) => (
                    <div className="movie-card" key={index}>
                        <img src={rec.poster} alt={rec.title} />
                        <h3>{rec.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
}

export default App;
