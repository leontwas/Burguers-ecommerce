import { useState } from 'react';
import '../css/login3.css'; 

export default function LoginRegister() {
  const [active, setActive] = useState(false); // false = login, true = register

  return (
    <div>
      <div className={`wrapper${active ? ' active' : ''}`}>
        <span className="bg-animate"></span>
        <span className="bg-animate2"></span>

        {/* FORM LOGIN */}
        <div className="form-box login">
          <h2 className="animation" style={{ '--i': 0 }}>Inicio de Sesión</h2>
          <form action="#">
            <div className="input-box animation" style={{ '--i': 1 }}>
              <input type="text" required />
              <label>Correo electrónico</label>
              <i className='bx bxs-envelope'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 2 }}>
              <input type="password" required />
              <label>Contraseña</label>
              <i className='bx bxs-lock'></i>
            </div>
            <button type="submit" className="btn animation" style={{ '--i': 3 }}>
              Iniciar Sesión
            </button>
            <div className="logreg-link animation" style={{ '--i': 4 }}>
              <p>
                ¿No tienes una cuenta?{' '}
                <a
                  href="#"
                  className="register-link"
                  onClick={e => {
                    e.preventDefault();
                    setActive(true);
                  }}
                >
                  Regístrate
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* INFO TEXT LOGIN */}
        <div className="info-text login">
          <h2 className="animation" style={{ '--i': 0 }}>
            Bienvenido
          </h2>
          <p className="animation" style={{ '--i': 1 }}>
            Para acceder ingresa un nombre de usuario, tu correo electrónico y una contraseña.
          </p>
        </div>

        {/* FORM REGISTER */}
        <div className="form-box register">
          <h2 className="animation" style={{ '--i': 0 }}>
            Regístrate
          </h2>
          <form action="#">
            <div className="input-box animation" style={{ '--i': 1 }}>
              <input type="text" required />
              <label>Nombre de usuario</label>
              <i className='bx bxs-user'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 2 }}>
              <input type="email" required />
              <label>Correo electrónico</label>
              <i className='bx bxs-envelope'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 3 }}>
              <input type="password" required />
              <label>Contraseña</label>
              <i className='bx bxs-lock'></i>
            </div>
            <button type="submit" className="btn animation" style={{ '--i': 4 }}>
              Registrarse
            </button>
            <div className="logreg-link animation" style={{ '--i': 5 }}>
              <p>
                ¿Ya tienes una cuenta?{' '}
                <a
                  href="#"
                  className="login-link"
                  onClick={e => {
                    e.preventDefault();
                    setActive(false);
                  }}
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* INFO TEXT REGISTER */}
        <div className="info-text register">
          <h2 className="animation" style={{ '--i': 0 }}>
            Bienvenido
          </h2>
          <p className="animation" style={{ '--i': 1 }}>
            Para acceder ingresa un nombre de usuario, tu correo electrónico y una contraseña.
          </p>
        </div>
      </div>
    </div>
  );
}