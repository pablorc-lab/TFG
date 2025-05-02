import { useEffect, useState } from "react";
import ReservasService from "../../../services/reservas/ReservasService";

const ListadoReservas = ({ styles }) => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    // Obtener reservas
    listarReservas();
  }, []);

  const listarReservas = () => {
    ReservasService.getAllReservas().then(response => {
      console.log(response.data)
      setReservas(response.data);
    }).catch(error => console.error("Error al listar las reservas : ", error));
  }
  
  const deleteReserva = (reservaID) => {
    let confirmacion = window.confirm(`¿Eliminar reserva? con ID : ${reservaID}`);

    if (confirmacion) {
      ReservasService.deleteReserva(reservaID)
        .then(() => listarReservas())
        .catch(error => console.error(`Error al eliminar la reserva con ID ${reservaID} : `, error));
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Anf_ID</th>
          <th>Viaj_ID</th>
          <th>Inicio</th>
          <th>Final</th>
          <th>Precio noche</th>
          <th>Precio final</th>
          <th>Ubicación</th>
          <th>Estado</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {reservas.map(reserva => (
          <tr key={reserva.id}>
            <td>{reserva.id}</td>
            <td>{reserva.anfitrion.id}</td>
            <td>{reserva.viajero.id}</td>
            <td>{reserva.fechaInicio}</td>
            <td>{reserva.fechaFin}</td>
            <td>{reserva.precio_noche} &euro;</td>
            <td>{reserva.precio_total} &euro;</td>
            <td>{reserva.ubicacion}</td>
            <td>{reserva.estado}</td>
            <td>
              <div className={`${styles.img_td} ${styles.delete}`}>
                <img
                  src="/images/admin_panel/delete.svg"
                  alt="Eliminar"
                  onClick={() => deleteReserva(reserva.id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ListadoReservas;
