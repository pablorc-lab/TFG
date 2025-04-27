import styles from "./AdminHeader.module.css"
import { Link} from "react-router-dom"


export default function AdminHeader({userType}){
  return (
    <>
     <header className={styles.header}>
        <nav>
          <Link to="/admin-panel/anfitrion" className={`${userType==="anfitrion" && styles.active}`}>
            Anfitriones
          </Link>
          <Link to="/admin-panel/viviendas" className={`${userType==="viviendas" && styles.active}`}>
            Viviendas
          </Link>
          <Link to="/admin-panel/reservas" className={`${userType==="reservas" && styles.active}`}>
            Reservas
          </Link>
          <Link to="/admin-panel/viajero" className={`${userType==="viajero" && styles.active}`}>
            Viajeros
          </Link>
          <Link to="/admin-panel/likes" className={`${userType==="likes" && styles.active}`}>
            Likes
          </Link>
          <Link to="/admin-panel/matches" className={`${userType==="matches" && styles.active}`}>
            Matches
          </Link>
        </nav>
      </header>
    </>
  );
}

