import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaTimes, FaSearch, FaChevronDown, FaChevronUp, FaUser, FaSignOutAlt, FaCog, FaBell, FaBookmark } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import '../../Styles/Header.css';
import { useSearch } from '../../contexts/SearchContext.jsx';
import LanguageSelector from '../User/LanguageSelector.jsx';
import { toast } from 'sonner';
import { authService } from '../../services/auth.service';
import { categoryService } from '../../services/category.service';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const { setGlobalSearchQuery } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const categoryRef = useRef(null);
  
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = userData?.email || '';
  const userName = userData?.name || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      if (response.success) {
        console.log("response categ :", response.data);
        setCategories(response.data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleMore = () => setIsMoreOpen(!isMoreOpen);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Handle profile menu
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      
      // Handle category dropdown
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setExpandedCategory(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleLogout = async () => {
    try {
      await authService.logout();
      console.log('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
      // Navigate to the category page using category ID
      navigate(`/user/category/${categoryId}`);
      // Close the mobile menu after navigation
      setIsNavOpen(false);
    } catch (error) {
      console.error('Error handling category click:', error);
      toast.error('Failed to load category news');
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/user/category/${subcategoryId}`);
    setExpandedCategory(null);
    setIsNavOpen(false);
  };

  // Get parent categories (categories without a parent)
  const parentCategories = categories.filter(category => !category.parent);

  // Filter parent categories to only show those with children
  const parentCategoriesWithChildren = parentCategories.filter(category => 
    category.children && category.children.length > 0
  );

  const currentDate = "Thursday, May 8, 2025 at 07:40 PM";
  const location = "Pune, Maharashtra, India";
  const breakingNews = "Global summit on climate change reaches historic agreement â€¢ Stock market hits new high";

  return (
    <header className="header-container">
      <div className="top-header">
        <Link to="/user/dashboard" style={{ textDecoration: 'none' }}>
          <h1 className="site-title">NewsApp</h1>
        </Link>
        <div className="top-header-right">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FaSearch className="search-icon" onClick={handleSearch} />
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LanguageSelector />
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button 
                onClick={handleProfileClick}
                className="profile-button"
                aria-label="Profile menu"
              >
                {userName ? (
                  <div className="avatar-circle">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <FaUser size={20} />
                )}
              </button>
              {profileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      {userName ? userName.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    <div className="profile-details">
                      <div className="profile-name">{userName || "Guest User"}</div>
                      <div className="profile-email">{userEmail || "No email provided"}</div>
                    </div>
                  </div>
                  
                  <div className="profile-divider"></div>
                  
                  <div className="profile-menu-items">
                    <div className="profile-menu-item" onClick={() => navigate('/user/profile')}>
                      <FaUser className="menu-icon" />
                      <span>My Profile</span>
                    </div>
                    <div className="profile-menu-item" onClick={() => navigate('/user/bookmarks')}>
                      <FaBookmark className="menu-icon" />
                      <span>Saved Articles</span>
                    </div>
                    <div className="profile-menu-item" onClick={() => navigate('/user/notifications')}>
                      <FaBell className="menu-icon" />
                      <span>Notifications</span>
                    </div>
                    <div className="profile-menu-item" onClick={() => navigate('/user/settings')}>
                      <FaCog className="menu-icon" />
                      <span>Settings</span>
                    </div>
                  </div>
                  
                  <div className="profile-divider"></div>
                  
                  <div className="profile-menu-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt className="menu-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="main-nav">
        <button className="menu-button" onClick={toggleNav} aria-label="Open menu">
          {isNavOpen ? <FaTimes /> : <FaBars />}
          <span className="menu-text">Menu</span>
        </button>

        <div className={`nav-overlay ${isNavOpen ? 'active' : ''}`} onClick={toggleNav}></div>
        <ul className={`nav-links ${isNavOpen ? 'active' : ''}`} ref={categoryRef}>
          <li className="nav-item nav-link-btn">
            <Link 
              to="/user/dashboard" 
              className="nav-link nav-link-btn-inner"
              onClick={() => setIsNavOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="nav-item nav-link-btn">
            <Link 
              to="/user/all-news" 
              className="nav-link nav-link-btn-inner"
              onClick={() => setIsNavOpen(false)}
            >
              All News
            </Link>
          </li>
          {parentCategoriesWithChildren.map((category) => (
            <li key={category._id} className="category-item">
              <div
                className="category-header"
                onClick={() => handleCategoryClick(category._id)}
                tabIndex={0}
              >
                <Link to={`/user/category/${category._id}`} className="nav-link nav-link-btn-inner">
                  {category.name}
                </Link>
                <span className="category-arrow">
                  {expandedCategory === category._id ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              {expandedCategory === category._id && (
                <div className="category-dropdown">
                  <ul className="subcategory-list">
                    {category.children.map((subcategory) => (
                      <li key={subcategory._id}>
                        <Link 
                          to={`/user/category/${subcategory._id}`} 
                          className="nav-link"
                          onClick={() => handleSubcategoryClick(subcategory._id)}
                        >
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
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