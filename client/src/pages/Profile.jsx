import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Please login to view profile</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="https://via.placeholder.com/100" alt="Profile" className="avatar" />
        <h2>@{user.username}</h2>
        <div className="stats">
          <div>
            <strong>100</strong> Following
          </div>
          <div>
            <strong>500</strong> Followers
          </div>
          <div>
            <strong>10k</strong> Likes
          </div>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="profile-content">
        <h3>My Games</h3>
        {/* List of games played or liked */}
      </div>
    </div>
  );
};

export default Profile;
