// src/context/LoginModalProvider.jsx
import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { LoginModalContext } from './LoginModalContext'; 

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (context === undefined) {
    throw new Error('useLoginModal debe ser usado dentro de un LoginModalProvider');
  }
  return context;
};

export function LoginModalProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const value = {
    showLogin,
    setShowLogin,
    openLogin,
    closeLogin,
  };

  return (
    <LoginModalContext.Provider value={value}>
      {children}
    </LoginModalContext.Provider>
  );
}

LoginModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginModalProvider; 