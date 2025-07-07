import React, { useState } from 'react';
import { AuthProvider, useAuth } from './utils/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WelcomePage from './components/WelcomePage';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

const AuthFlow: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <WelcomePage />;
  }

  return (
    <div className="app">
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthFlow />
    </AuthProvider>
  );
};

export default App;
