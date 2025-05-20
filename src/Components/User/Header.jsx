import React, { useState } from 'react';
import { FaBars, FaTimes, FaSearch, FaChevronDown, FaChevronUp, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import '../../Styles/Header.css';
import { useSearch } from '../../contexts/SearchContext.jsx';
import LanguageSelector from '../User/LanguageSelector.jsx';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { setGlobalSearchQuery } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Get user email from localStorage
  const userEmail = JSON.parse(localStorage.getItem('currentUser'))?.email || '';

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleMore = () => setIsMoreOpen(!isMoreOpen);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setGlobalSearchQuery(query);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setGlobalSearchQuery(searchQuery);
  };

  const handleProfileClick = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const moreCategories = [
    { name: 'Science', path: '/category/science' },
    { name: 'Climate', path: '/category/climate' },
    { name: 'Weather', path: '/category/weather' },
    { name: 'Ukraine-Russia War', path: '/category/ukraine-russia-war' },
    { name: 'Israel-Hamas War', path: '/category/israel-hamas-war' },
    { name: 'Games', path: '/category/games' }
  ];

  const currentDate = "Thursday, May 8, 2025 at 07:40 PM";
  const location = "Pune, Maharashtra, India";
  const breakingNews = "Global summit on climate change reaches historic agreement • Stock market hits new high";

  return (
    <header className="header-container">
      <div className="top-header">
        <Link to="/user/dashboard" style={{ textDecoration: 'none' }}>
          <h1 className="site-title">NewsApp</h1>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LanguageSelector />
          <div className="profile-menu-container">
            <button 
              onClick={handleProfileClick}
              className="profile-button"
            >
              <FaUser size={20} />
            </button>
            {profileMenuOpen && (
              <div className="profile-dropdown">
                <div className="profile-email">{userEmail}</div>
                <div className="profile-menu-item" onClick={() => navigate('/user/profile')}>
                  <FaUser size={16} />
                  <span>Profile</span>
                </div>
                <div className="profile-menu-item" onClick={handleLogout}>
                  <FaSignOutAlt size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="main-nav">
        <button className="menu-button" onClick={toggleNav}>
          {isNavOpen ? <FaTimes /> : <FaBars />}
          <span className="menu-text">Menu</span>
        </button>

        <ul className={`nav-links ${isNavOpen ? 'active' : ''}`}>
          <li><a href="/user/dashboard">Home</a></li>
          <li><a href="/user/category/politics">Politics</a></li>
          <li><a href="/user/category/business">Business</a></li>
          <li><a href="/user/category/technology">Technology</a></li>
          <li><a href="/user/category/entertainment">Entertainment</a></li>
          <li><a href="/user/category/sports">Sports</a></li>
          <li className="more-dropdown">
            <button onClick={toggleMore} className="more-btn">
              More {isMoreOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isMoreOpen && (
              <ul className="dropdown-list">
                {moreCategories.map((cat) => (
                  <li key={cat.name}><a href={cat.path}>{cat.name}</a></li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </form>
      </nav>
      <div className="breaking-news">
        <span className="breaking-label">BREAKING NEWS:</span>
        <div className="news-ticker">
          <p>{breakingNews}</p>
        </div>
      </div>

    </header>
  );
};

export default Header;
