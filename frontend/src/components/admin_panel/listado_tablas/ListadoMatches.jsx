import { useState, useEffect } from "react";
import MatchesService from "../../../services/matches/MatchesService";

export default function ListadoMatches({styles}) {
  const [matches, setMaches] = useState([]);

  useEffect(() => {
    // Obtener matches
    listarMatchs();
  }, []);

  const listarMatchs = () => {
    MatchesService.getAll().then(response => {
      console.log(response.data)
      // Obtener el id de cada anfitrion y su vivienda
      setMaches(response.data);
    }).catch(error => console.error("Error al listar los matches : ", error));
  }

  const deleteMatch = (matchID) => {
    let confirmacion = window.confirm(`¿Eliminar match? con ID : ${matchID}`);

    if (confirmacion) {
      AnfitrionService.deleteMatch(matchID)
        .then(() => listarMatchs())
        .catch(error => console.error(`Error al eliminar el match con ID ${matchID} : `, error));
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Viajero ID</th>
          <th>Anfitrion ID</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {matches.sort((a,b) => a.id - b.id).map(match => (
          <tr key={match.id}>
            <td>{match.id}</td>
            <td>{match.viajeroID}</td>
            <td>{match.anfitrionID}</td>
            <td>
              <div className={`${styles.img_td} ${styles.delete}`}>
                <img
                  src="/images/admin_panel/delete.svg"
                  alt="Eliminar"
                  onClick={() => deleteMatch(match.id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
