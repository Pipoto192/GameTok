import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., check token in localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend (mocked for now)
      setUser({ username: 'User' }); // Replace with actual user data fetch
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Implement login logic
    // const res = await axios.post('http://localhost:3000/login', { username, password });
    // localStorage.setItem('token', res.data.token);
    // setUser(res.data.user);
    console.log('Login', username, password);
    setUser({ username });
    localStorage.setItem('token', 'mock-token');
  };

  const register = async (username, password) => {
    // Implement register logic
    console.log('Register', username, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
