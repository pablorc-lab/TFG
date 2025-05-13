import styles from "./AdminHeader.module.css"
import { Link } from "react-router-dom"
import AuthService from "../../services/authentication/AuthService";

export default function AdminHeader({ userType }) {
  const handleLogout = () => {
    AuthService.logout();
  }

  return (
    <header className={styles.header}>
      <nav>
        <Link to="/admin-panel/anfitrion" className={`${userType === "anfitrion" && styles.active}`}>
          Anfitriones
        </Link>
        <Link to="/admin-panel/viajero" className={`${userType === "viajero" && styles.active}`}>
          Viajeros
        </Link>
        <Link to="/admin-panel/viviendas" className={`${userType === "viviendas" && styles.active}`}>
          Viviendas
        </Link>
        <Link to="/admin-panel/reservas" className={`${userType === "reservas" && styles.active}`}>
          Reservas
        </Link>
        <Link to="/admin-panel/likes" className={`${userType === "likes" && styles.active}`}>
          Likes
        </Link>
        <Link to="/admin-panel/matches" className={`${userType === "matches" && styles.active}`}>
          Matches
        </Link>
        <Link to="/admin-panel/valoraciones" className={`${userType === "valoraciones" && styles.active}`}>
          Valoraciones
        </Link>
        <Link to="/admin-panel/login" onClick={handleLogout}>
          Cerrar sesión
        </Link>
      </nav>
    </header>
  );
}

