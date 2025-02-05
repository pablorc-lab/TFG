import { useEffect, useState } from 'react'
import styles from "./ListUsuariosPage.module.css"
import AnfitrionService from '../../../services/AnfitrionService';
import AdminHeader from '../../../components/admin_panel/AdminHeader';
import { Link } from 'react-router-dom';

export default function ListUsuariosPage() {

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    listarUsuarios();
  }, [])

  const listarUsuarios = () => {
    AnfitrionService.getAllAnfitriones().then(response => {
      setUsuarios(response.data);
      console.log(response.data);
    }).catch(error => { console.log(error); })
  }
  const deleteCliente = (clienteId) => {
    AnfitrionService.deleteAnfitrionByID(clienteId).then((response) => {
      listarUsuarios();
    }).catch(error => { console.log(error); })
  }
  return (
    <>
      <AdminHeader />
      <div className={styles.container}>
        <h2> Lista de empleados</h2>
        <Link to="/add-usuario" className={styles.link_list}>
          Agregar usuario
        </Link>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td> {/* No olvides mostrar el ID */}
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td style={{ display: "flex" }}>
                  <button className={styles.acciones}>
                    <Link to={`/edit-usuario/${usuario.id}`}>Actualizar</Link>
                  </button>
                  <button className={styles.eliminar} onClick={() => deleteCliente(usuario.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
