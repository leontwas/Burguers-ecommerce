// src/context/LoginModalContext.jsx
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const LoginModalContext = createContext();

export const useLoginModal = () => useContext(LoginModalContext);

export function LoginModalProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <LoginModalContext.Provider value={{ showLogin, setShowLogin }}>
      {children}
    </LoginModalContext.Provider>
  );
}

LoginModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
