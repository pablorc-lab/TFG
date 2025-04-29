import { useState } from "react"
import styles from "./Seguridad.module.css"
import AuthService from "../../../../services/authentication/AuthService";

export default function SeguridadMiCuenta({ userService, handleLogout, userID, userEmail }) {
  const [errorPassword, setErrorPassword] = useState(false);
  const [correctPassword, setCorrectPassword] = useState(true);
  const [samePassword, setSamePassword] = useState(false);

  const [actualPassword, SetActualPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleGuardarCambios = () => {

    setErrorPassword(newPassword.length < 8);
    setSamePassword(newPassword === actualPassword);
    if (newPassword.length < 8 || newPassword === actualPassword) return;

    const user = localStorage.getItem("user");

    AuthService.verify(user, {email: userEmail, password: actualPassword})
      .then(response => {
        setCorrectPassword(response.data);

        if (response.data) {
          userService.update(userID, { password: newPassword })
            .then(response => handleLogout())
            .catch(error => console.error("Error al cambiar la contraseña", error))
        }
      })
      .catch(error => console.error("Error al verificar contraseña " + error))
  };

  return (
    <section className={styles.seguridad_section}>
      <h1>Cambiar contraseña</h1>

      <article>

        {errorPassword && <p className={styles.error_msg}>La nueva contraseña debe tener mínimo 8 carácteres</p>}
        {samePassword && !errorPassword && <p className={styles.error_msg}>Las contraseñas son iguales</p>}
        {!correctPassword && !errorPassword && !samePassword && <p className={styles.error_msg}>Contraseña incorrecta</p>}

        <form className={styles.seguridad_form}>
          <div>
            <p>Contraseña actual</p>
            <input type="password" name="password" value={actualPassword} onChange={(e) => SetActualPassword(e.target.value)} />
          </div>
          <div>
            <p>Nueva contraseña</p>
            <input type="password" name="repeat_password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </form>
        <button className={styles.seguridad_save} onClick={() => handleGuardarCambios()}>
          Guardar cambios
        </button>
      </article>

      <div className={styles.seguridad_delete}>
        <button>Eliminar cuenta</button>
      </div>
    </section>
  )
}
