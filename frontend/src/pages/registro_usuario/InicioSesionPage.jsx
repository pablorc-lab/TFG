import { useState } from "react";
import styles from "./accesos.module.css"
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/authentication/AuthService";

export default function InicioSesionPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [loginRequest, setLoginRequest] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    if (loginRequest.email === "" || loginRequest.password === "") {
      setLoginError(true);
      setLoading(false);
      return;
    }

    AuthService.login(loginRequest)
      .then(response => {
        console.log(response.data);
        setLoginError(false);
        setFinish(true);

        localStorage.setItem("acces_token", response.data.acces_token);
        localStorage.setItem("user", response.data.User);

        navigate(response.data.User === "Anfitrion (1)" ? "/anfitriones/inquilinos" : "/viajeros/alojamientos");
      })
      .catch(error => {
        console.error("Error en el login " + error);
        setLoginError(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ cursor: loading ? 'wait' : 'default' }}>
      <title>Iniciar sesión | Bearfrens</title>
      <section className={styles.acceso_section}>
        <header className={styles.acceso_header}>
          <figure>
            <Link to="/inicio">
              <img src="/images/logos/logo_blanco.png" alt="logo blanco" />
              <figcaption>Bearfrens</figcaption>
            </Link>
          </figure>
        </header>

        <article className={styles.acceso_container}>
          {!finish ? (<>
            <h1>Inicio de sesión</h1>

            <form>
              {loginError && <p className={styles.error_login}>Email o Contraseña incorrectos</p>}

              <fieldset className={styles.input_container}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  spellCheck="false"
                  value={loginRequest.email}
                  onChange={(e) => setLoginRequest(prev => ({ ...prev, email: e.target.value }))}
                />
              </fieldset>
              <fieldset className={styles.input_container}>
                <label htmlFor="password">Contraseña</label>
                <div className={styles.input_password}>
                  <img
                    src={`/images/registro/${showPassword ? "reveal" : "hide"}_password.svg`}
                    alt="Reveal password"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={loginRequest.password}
                    onChange={(e) => setLoginRequest(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Link style={{ textAlign: "right", marginTop : "3px" }} to="/">¿Contraseña olvidada?</Link>
              </fieldset>

              <input
                className={styles.submit_input}
                type="submit"
                value="Iniciar sesión"
                onClick={handleLogin}
                style={{
                  filter: loading ? 'brightness(70%)' : 'none',
                  cursor: loading ? 'wait' : 'pointer'
                }}
                disabled={loading}
              />
            </form>
            <div className={styles.acceso_enlace_registro}>
              <h2>¿No tienes cuenta?</h2>
              <Link to="/registro">Registrarse ahora</Link>
            </div>
          </>
          ) : (
            <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "70px 0" }} />
          )}
        </article>
      </section>
    </div>

  )
}