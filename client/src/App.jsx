import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Create from './pages/Create';
import Inbox from './pages/Inbox';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/create" element={<Create />} />
            <Route path="/inbox" element={<Inbox />} />
          </Routes>
          <Navbar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
