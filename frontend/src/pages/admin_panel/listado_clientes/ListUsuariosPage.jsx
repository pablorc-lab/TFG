import { useEffect, useState } from 'react'
import styles from "./ListUsuariosPage.module.css"
import AdminHeader from '../../../components/admin_panel/AdminHeader';
import { Link, useParams } from 'react-router-dom';

export default function ListUsuariosPage() {
  const { userType } = useParams();
  const [userService, setUserService] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  // Cargar el servicio actual requerido
  useEffect(() => {
    const loadService = async () => {
      const tempService = userType === "anfitrion"
        ? (await import("../../../services/AnfitrionService")).default
        : (await import("../../../services/ViajeroService")).default;

      setUserService(tempService);
    };
    loadService();
  }, [userType])


  useEffect(() => {
    if (userService) {
      setTimeout(() => {listarUsuarios();}, 300);
    }
  }, [userService]);


  const listarUsuarios = () => {
    userService.getAll()
      .then(response => setUsuarios(response.data))
      .catch(error => console.error("Error al listar los usuarios : ",error));
  };

  const deleteCliente = (usuarioID) => {
    let confirmacion = window.confirm(`¿Eliminar usuario? con ID : ${usuarioID}`);

    if (confirmacion) {
      userService.delete(usuarioID)
        .then(() => listarUsuarios())
        .catch(error => console.error(`Error al eliminar el usuario con ID ${usuarioID} : `,error));
    }
  }

  return (
    <>
      <title>{`Admin panel | Listar ${userType}`}</title>
      <AdminHeader userType={userType} />

      <article className={styles.container}>
        <h2>Usuario: <span>{userType}</span></h2>

        <div className={styles.button_list}>
          <Link to={`/admin-panel/${userType}/crear`} className={styles.link_list}>
            Agregar {userType}
          </Link>
          <img src="/images/admin_panel/reload.svg" alt="Reload" onClick={() => listarUsuarios()} />
        </div>

        <section className={styles.table_container}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>PrivateID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Fecha</th>
                <th>Email</th>
                <th>Profile_Image</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.privateID}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.fecha_nacimiento}</td>
                  <td>{usuario.email}</td>
                  <td><a href={usuario.profileImage} target="_blank" rel="noopener noreferrer">{usuario.profileImage}</a></td>
                  <td >
                    <div className={styles.img_td}>
                      <Link to={`/admin-panel/${userType}/editar/${usuario.id}`}>
                        <img src="/images/admin_panel/edit.svg" alt="Icono delete" />
                      </Link>
                      <img src="/images/admin_panel/delete.svg" alt="Icono delete" onClick={() => deleteCliente(usuario.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>
    </>
  )
}