import { useState, useEffect } from "react";
import ValoracionesService from "../../../services/valoraciones/ValoracionesService";

export default function ListadoValoraciones({ styles }) {
  const [valoraciones, setValoraciones] = useState([]);

  useEffect(() => {
    // Obtener likes
    listarValoraciones();
  }, []);

  const listarValoraciones = () => {
    ValoracionesService.getAll().then(response => {
      console.log(response.data);
      setValoraciones(response.data);
    }).catch(error => console.error("Error al listar las valoraciones : ", error));
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nota</th>
          <th>Emisor ID</th>
          <th>Emisor Nombre</th>
          <th>Emisor imagen perfil</th>
          <th>Receptor ID</th>
          <th>Tipo receptor</th>
          <th>Fecha</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {valoraciones.map(valoracion => (
          <tr key={valoracion.id}>
            <td>{valoracion.id}</td>
            <td>{valoracion.num_valoracion} / 5</td>
            <td>{valoracion.emisorID}</td>
            <td>{valoracion.emisor_nombre}</td>
            <td>
              <a href={valoracion.emisor_profile_img} target="_blank" rel="noopener noreferrer">
                {(valoracion.emisor_profile_img?.length > 20 ? `${valoracion.emisor_profile_img.slice(0, 20)}...` : valoracion.profileImage) || "-"}
              </a>
            </td>
            <td>{valoracion.usuarioID}</td>
            <td>{valoracion.tipoUsuario} - {valoracion.tipoUsuario === 1 ? "Anfitrión" : "Viajero"}</td>
            <td>{valoracion.fecha}</td>
            <td>
              {(valoracion.descripcion?.length > 50 ? `${valoracion.descripcion.slice(0, 50)}...` : valoracion.descripcion) || "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
