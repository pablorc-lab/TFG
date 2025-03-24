import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function ListadoUsuarios({ styles, userType }) {
  const [userService, setUserService] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  // Cargar el servicio actual requerido
  useEffect(() => {
    const loadService = async () => {
      const tempService = userType === "anfitrion"
        ? (await import("../../../services/users/AnfitrionService")).default
        : (await import("../../../services/users/ViajeroService")).default;

      setUserService(tempService);
    };
    loadService();
  }, [userType])


  useEffect(() => {
    if (userService) {
      setTimeout(() => { listarUsuarios(); }, 300);
    }
  }, [userService]);


  const listarUsuarios = () => {
    userService.getAll()
      .then(response => setUsuarios(response.data))
      .catch(error => console.error("Error al listar los usuarios : ", error));
  };

  const deleteCliente = (usuarioID) => {
    let confirmacion = window.confirm(`¿Eliminar usuario? con ID : ${usuarioID}`);

    if (confirmacion) {
      userService.delete(usuarioID)
        .then(() => listarUsuarios())
        .catch(error => console.error(`Error al eliminar el usuario con ID ${usuarioID} : `, error));
    }
  }

  return (
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
          <th>Gusto1</th>
          <th>Gusto2</th>
          <th>Gusto3</th>
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
            <td>
              <a href={usuario.profileImage} target="_blank" rel="noopener noreferrer">
                {usuario.profileImage.length > 30 ? `${usuario.profileImage.slice(0,30)}...` : usuario.profileImage}
              </a>
            </td>
            <td>{usuario.gusto1}</td>
            <td>{usuario.gusto2}</td>
            <td>{usuario.gusto3}</td>
            <td>
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
  )
}