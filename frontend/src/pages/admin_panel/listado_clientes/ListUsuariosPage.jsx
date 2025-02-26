import { useEffect, useState } from 'react'
import styles from "./ListUsuariosPage.module.css"
import AdminHeader from '../../../components/admin_panel/AdminHeader';
import { Link, useLocation, useParams } from 'react-router-dom';

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
      listarUsuarios();
    }
  }, [userService]);


  const listarUsuarios = () => {
    userService.getAll()
      .then(response => setUsuarios(response.data))
      .catch(error => console.log(error));
  };

  const deleteCliente = (usuarioID) => {
    let confirmacion = window.confirm(`¿Eliminar usuario? con ID : ${usuarioID}`);

    if (confirmacion) {
      userService.delete(usuarioID)
        .then(() => listarUsuarios())
        .catch(error => console.log(error));
    }
  }

  return (
    <>
      <title>{`Admin panel | Listar ${userType}`}</title>
      <AdminHeader userType={userType} />

      <div className={styles.container}>
        <h2>Usuario: <span>{userType}</span></h2>

        <Link to={`/admin-panel/${userType}/crear`} className={styles.link_list}>
          Agregar {userType}
        </Link>

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
                  <td>{usuario.profileImage}</td>
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

      </div>
    </>
  )
}