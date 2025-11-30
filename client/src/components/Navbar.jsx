import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/" className="nav-item">Home</Link>
      <Link to="/discover" className="nav-item">Discover</Link>
      <Link to="/create" className="nav-item">Create</Link>
      <Link to="/inbox" className="nav-item">Inbox</Link>
      <Link to="/profile" className="nav-item">Profile</Link>
    </nav>
  );
};

export default Navbar;
