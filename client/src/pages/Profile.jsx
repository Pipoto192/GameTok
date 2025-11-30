import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ gamesPlayed: 0, totalScore: 0 });

  useEffect(() => {
    // Fetch user stats if we had an endpoint for it
    // For now just mock or leave empty
  }, [user]);

  if (!user) {
    return (
      <div className="profile-container" style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
        <h2>Please login to view profile</h2>
        <a href="/login" style={{ color: '#fe2c55' }}>Login here</a>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="https://via.placeholder.com/100" alt="Profile" className="avatar" />
        <h2>@{user.username}</h2>
        <div className="stats">
          <div>
            <strong>0</strong> Following
          </div>
          <div>
            <strong>0</strong> Followers
          </div>
          <div>
            <strong>0</strong> Likes
          </div>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="profile-content">
        <h3>My Stats</h3>
        <p>Logged in as: {user.username}</p>
        {/* List of games played or liked */}
      </div>
    </div>
  );
};

export default Profile;
