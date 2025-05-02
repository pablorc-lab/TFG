import axios from "axios";

class ReservasService {
  static RESERVAS_BASE_REST_API_URL = "http://localhost:8080/api/reservas";

  static getAllReservas(){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/list`);
  }

  static getIngresoAnfitrion(anfitrioID){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/anfitrion/${anfitrioID}/ingreso`);
  }

  static gestGastosViajero(viajeroID){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/viajero/${viajeroID}/gasto`);
  }

  static getReservasViajero(viajeroID, fechaMes){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/viajero/${viajeroID}/${fechaMes}`);
  }
  
  static getReservasAnfitrion(anfitrionID, fechaMes){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/anfitrion/${anfitrionID}/${fechaMes}`);
  }

  static crearReserva(anfitrionID, viajeroID, fechaInicio, fechaFin){
    return axios.post(`${this.RESERVAS_BASE_REST_API_URL}/crear/${anfitrionID}/${viajeroID}/${fechaInicio}/${fechaFin}`);
  }

  static cancelarReserva(anfitrionID, viajeroID, fechaInicio, fechaFin){
    return axios.post(`${this.RESERVAS_BASE_REST_API_URL}/cancelar/${anfitrionID}/${viajeroID}/${fechaInicio}/${fechaFin}`);
  }

  static deleteReserva(reservaID){
    return axios.delete(`${this.RESERVAS_BASE_REST_API_URL}/eliminar/${reservaID}`);
  }
}

export default ReservasService;