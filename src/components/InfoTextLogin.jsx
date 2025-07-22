// src/components/InfoTextLogin.jsx
export default function InfoTextLogin() {
  return (
    <div className="info-text login">
      <h2 className="animation" style={{'--i': 0}}>Bienvenido</h2>
      <p className="animation" style={{'--i': 1}}>
        Para acceder ingresa un nombre de usuario, tu correo electrónico y una contraseña.
      </p>
    </div>
  );
}