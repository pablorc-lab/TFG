import styles from "./LoginAdmin.module.css";
import AuthService from "../../services/authentication/AuthService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const [loginRequest, setLoginRequest] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginRequest.email === "" || loginRequest.password === "") {
      setLoginError(true);
      return;
    }

    AuthService.loginAdmin(loginRequest)
      .then(response => {
        console.log(response.data);
        setLoginError(false);

        localStorage.setItem("acces_token", response.data.acces_token);
        localStorage.setItem("refresh_token", response.data.acces_token);
        localStorage.setItem("user", response.data.User);

        navigate("/admin-panel");
      })
      .catch(error => {
        console.error("Error en el login " + error);
        setLoginError(true);
      })
  };

  return (
    <>
      <title>Login | Admin</title>

      <Link to="/inicio">
        <img src="/images/admin_panel/home.svg" alt="inicio" className={styles.home}/>
      </Link>

      <main className={styles.soporteMain}>
        <h1>Admin Panel</h1>

        <form className={styles.soporteForm}>
          {loginError && <p className={styles.error_login}>Email o Contraseña incorrectos</p>}

          <div>
            <label htmlFor="nombre">Usuario:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={loginRequest.email}
              onChange={(e) => setLoginRequest(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={loginRequest.password}
              onChange={(e) => setLoginRequest(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <button type="submit" onClick={handleLogin}>Enviar</button>
        </form>
      </main>
    </>
  );
}

export default LoginAdmin;
