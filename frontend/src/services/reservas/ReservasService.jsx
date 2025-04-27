import axios from "axios";

class ReservasService {
  static RESERVAS_BASE_REST_API_URL = "http://localhost:8080/api/reservas";

  static getAllReservas(){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/list`);
  }

  static deleteReserva(reservaID){
    return axios.delete(`${this.RESERVAS_BASE_REST_API_URL}/eliminar/${reservaID}`);
  }
}

export default ReservasService;