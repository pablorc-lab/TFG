import { useState, useEffect } from "react";
import LikesService from "../../../services/matches/LikesService";

export default function ListadoLikes({styles}) {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    // Obtener likes
    listarLikes();
  }, []);

  const listarLikes = () => {
    LikesService.getAll().then(response => {
      console.log(response.data)
      setLikes(response.data);
    }).catch(error => console.error("Error al listar los likes : ", error));
  }

  const deleteLike = (likeID, tipoUsuario, emisorID, usuarioID) => {
    let confirmacion = window.confirm(`¿Eliminar like? con ID : ${likeID}`);

    if (confirmacion) {
      tipoUsuario = tipoUsuario === 1 ? "viajeros" : "anfitriones";
      LikesService.deleteLike(tipoUsuario, emisorID, usuarioID)
        .then(() => listarLikes())
        .catch(error => console.error(`Error al eliminar el like con ID ${likeID} : `, error));
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Emisor ID</th>
          <th>Receptor ID</th>
          <th>Tipo usuario receptor</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {likes.map(like => (
          <tr key={like.id}>
            <td>{like.id}</td>
            <td>{like.emisorID}</td>
            <td>{like.usuarioID}</td>
            <td>{like.tipoUsuario} - {like.tipoUsuario === 1 ? "Anfitrión" : "Viajero"}</td>
            <td>
              <div className={`${styles.img_td} ${styles.delete}`}>
                <img
                  src="/images/admin_panel/delete.svg"
                  alt="Eliminar"
                  onClick={() => deleteLike(like.id, like.tipoUsuario, like.emisorID, like.usuarioID)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
