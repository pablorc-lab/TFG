import { useEffect, useState } from 'react'
import AnfitrionService from '../../../services/users/AnfitrionService'
import { Link } from 'react-router-dom';

export default function ListadoViviendas({ styles }) {
  const [viviendas, setViviendas] = useState([]);

  // Obtener las viviendas
  useEffect(() => {
    // Obtener viviendas
    listarViviendas();
  }, []);

  const listarViviendas = () => (
    AnfitrionService.getAll().then(response => {
      // Obtener el id de cada anfitrion y su vivienda
      setViviendas(response.data
        .map(anfitrion => anfitrion.vivienda)
        .filter(vivienda => vivienda !== null)
      );
    }).catch(error => console.error("Error al listar los usuarios : ", error))
  );

  const deleteVivienda = (anfitrionID) => {
    let confirmacion = window.confirm(`¿Eliminar vivienda? con Anfitrión ID : ${anfitrionID}`);

    if (confirmacion) {
      AnfitrionService.eliminarVivienda(anfitrionID)
        .then(() => listarViviendas())
        .catch(error => console.error(`Error al eliminar la vivienda con ID ${anfitrionID} : `, error));
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Anf_ID</th>
          <th>Imagen 1</th>
          <th>Imagen 2</th>
          <th>Imagen 3</th>
          <th>Imagen 4</th>
          <th>Viajeros</th>
          <th>Habts</th>
          <th>Camas</th>
          <th>Baños</th>
          <th>Provincia</th>
          <th>Ciudad</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {viviendas.map(vivienda => (
          <tr key={vivienda.id}>
            <td>{vivienda.id}</td>
            <td>{vivienda.anfitrion_id}</td>
            <td>
              <a href={vivienda.imagen1 ||null} target="_blank" rel="noopener noreferrer">
                {vivienda.imagen1 ? (vivienda.imagen1.length > 25 ? `${vivienda.imagen1.slice(0, 25)}...` : vivienda.imagen1) : "null"}
              </a>
            </td>
            <td>
              <a href={vivienda.imagen2 || null} target="_blank" rel="noopener noreferrer">
                {vivienda.imagen2 ? (vivienda.imagen2.length > 25 ? `${vivienda.imagen2.slice(0, 25)}...` : vivienda.imagen2) : "null"}
              </a>
            </td>
            <td>
              <a href={vivienda.imagen3 || null} target="_blank" rel="noopener noreferrer">
                {vivienda.imagen3 ? (vivienda.imagen3.length > 25 ? `${vivienda.imagen3.slice(0, 25)}...` : vivienda.imagen3) : "null"}
              </a>
            </td>
            <td>
              <a href={vivienda.imagen4 || null} target="_blank" rel="noopener noreferrer">
                {vivienda.imagen4 ? (vivienda.imagen4.length > 25 ? `${vivienda.imagen4.slice(0, 25)}...` : vivienda.imagen4) : "null"}
              </a>
            </td>

            <td>{vivienda.viajeros}</td>
            <td>{vivienda.habitaciones}</td>
            <td>{vivienda.camas}</td>
            <td>{vivienda.banios}</td>
            <td>{vivienda.provincia}</td>
            <td>{vivienda.ciudad}</td>
            <td>{vivienda.precio_noche} €</td>
            <td>
              <div className={styles.img_td}>
                <Link to={`/admin-panel/viviendas/editar/${vivienda.anfitrion_id}`}>
                  <img src="/images/admin_panel/edit.svg" alt="Editar" />
                </Link>
                <img
                  src="/images/admin_panel/delete.svg"
                  alt="Eliminar"
                  onClick={() => deleteVivienda(vivienda.anfitrion_id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
