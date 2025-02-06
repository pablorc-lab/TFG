import { useEffect, useState } from 'react'
import styles from "./ListUsuariosPage.module.css"
import AdminHeader from '../../../components/admin_panel/AdminHeader';
import { Link, useParams } from 'react-router-dom';

export default function ListUsuariosPage() {
  const { userType } = useParams();
  const [service, setService] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  // Cargar el servicio actual requerido
  useEffect(() => {
    const loadService = async () => {
      setService(
        userType === "anfitrion" 
        ? (await import("../../../services/AnfitrionService")).default
        :(await import("../../../services/ViajeroService")).default
      );
    };

    loadService();  
  }, [userType])

  // Listar usuarios al renderizar el componente si hay un servicio
  useEffect(() => {
    if (service) {
      listarUsuarios();
    }
  }, [service])

  const listarUsuarios = () => {
    service.getAll().then(response => {
      setUsuarios(response.data);
      console.log(userType, response.data);
    }).catch(error => { console.log(error); })
  }

  const deleteCliente = (usuarioID) => {
    let confirmacion = window.confirm(`¿Eliminar usuario? con ID : ${usuarioID}`);
    if (confirmacion) {
      service.delete(usuarioID).then((response) => {
        listarUsuarios();
      }).catch(error => { console.log(error); })
    }
  }

  return (
    <>
      <AdminHeader userType={userType}/>
      <div className={styles.container}>
        <h2>User type : <i>{userType}</i></h2>
        <Link to="/add-usuario" className={styles.link_list}>
          Agregar anfitrion
        </Link>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>PrivateID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Edad</th>
              <th>Email</th>
              <th>profileImage</th>
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
                <td>{usuario.edad}</td>
                <td>{usuario.email}</td>
                <td>{usuario.profileImage}</td>
                <td >
                  <div className={styles.img_td}>
                    <Link to={`/edit-usuario/${usuario.id}`}>
                      <img src="/images/admin_panel/edit.svg" alt="Icono delete" />
                    </Link>
                    <img src="/images/admin_panel/delete.svg" alt="Icono delete" onClick={() => deleteCliente(usuario.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}