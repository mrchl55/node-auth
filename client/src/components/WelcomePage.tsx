import React, { useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';

const WelcomePage: React.FC = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp && payload.exp < currentTime) {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
    };

    const interval = setInterval(handleTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [logout]);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1>welcome!</h1>
      </div>
      
      <div className="welcome-message">
        hello, {user.email}
      </div>
      
      <div className="user-info">
        <h3>your account</h3>
        <p>{user.email}</p>
      </div>
      
      <button 
        onClick={handleLogout}
        className="logout-btn"
      >
        logout
      </button>
    </div>
  );
};

export default WelcomePage; 