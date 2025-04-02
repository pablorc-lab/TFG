import styles from "./ListTablasPage.module.css"
import AdminHeader from '../../components/admin_panel/AdminHeader';
import { Link, useParams } from 'react-router-dom';
import ListadoUsuarios from "../../components/admin_panel/listado_tablas/ListadoUsuarios";
import ListadoViviendas from "../../components/admin_panel/listado_tablas/ListadoViviendas";
import ListadoMatches from "../../components/admin_panel/listado_tablas/ListadoMatches";
import ListadoLikes from "../../components/admin_panel/listado_tablas/ListadoLikes";

export default function ListTablasPage() {
  const { userType } = useParams();

  return (
    <>
      <title>{`Admin panel | Listar ${userType}`}</title>
      <AdminHeader userType={userType} />

      <article className={styles.container}>
        <h2><span>{userType}</span></h2>

        {userType !== "matches" && userType !== "likes" &&
          <div className={styles.button_list}>
            <Link to={`/admin-panel/${userType}/crear`} className={styles.link_list}>
              Agregar {userType}
            </Link>
          </div>
        }

        <section className={styles.table_container}>
          {(userType === "anfitrion" || userType === "viajero") && <ListadoUsuarios styles={styles} userType={userType} />}
          {userType === "viviendas" && <ListadoViviendas styles={styles} />}
          {userType === "likes" && <ListadoLikes styles={styles} />}
          {userType === "matches" && <ListadoMatches styles={styles} />}
        </section>
      </article>
    </>
  )
}