import React, { useEffect, useState } from 'react'
import AnfitrionService from '../../../services/users/AnfitrionService'
import { Link } from 'react-router-dom';

export default function ListadoViviendas({styles}) {
  const [viviendas, setViviendas] = useState([]);

  // Obtener las viviendas
  useEffect(() => {

    // Obtener anfitriones
    AnfitrionService.getAll().then(response => {
      // Obtener el id de cada anfitrion y su vivienda
      setViviendas(response.data
        .map(anfitrion => anfitrion.vivienda)
        .filter(vivienda => vivienda !== null)
      );
    }).catch(error => console.error("Error al listar los usuarios : ", error));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Anf_ID</th>
          <th>Imagen 1</th>
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
              <a href={vivienda.imagen1} target="_blank" rel="noopener noreferrer">
                {vivienda.imagen1.length > 30 ? `${vivienda.imagen1.slice(0, 30)}...` : vivienda.imagen1}
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
                  onClick={() => deleteVivienda(vivienda.id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
