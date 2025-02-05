import styles from "./AdminHeader.module.css"
import { Link} from "react-router-dom"


export default function AdminHeader(){
  return (
    <>
     <header className={styles.header}>
        <nav>
          <Link to="/admin-panel/anfitriones">Usuarios</Link>
          <Link to="/admin-panel/anfitriones">Anfitriones</Link>
          <Link to="/admin-panel/anfitriones">Viajeros</Link>
        </nav>
      </header>
    </>
  );
}

