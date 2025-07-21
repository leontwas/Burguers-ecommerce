// src/components/LoginModal.jsx
import ReactDOM from 'react-dom';
import LoginRegister from './LoginRegister';
import '../css/login.css'; 

const LoginModal = ({ onClose }) => {
  if (!document.getElementById('modal-root')) {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay"> 
      <div className="modal-content"> 
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <LoginRegister onClose={onClose} />
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default LoginModal;