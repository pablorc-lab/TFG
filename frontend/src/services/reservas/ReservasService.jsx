import axios from "axios";
import AuthService from "../authentication/AuthService";

class ReservasService {

  static RESERVAS_BASE_REST_API_URL = "http://localhost:8080/api/reservas";

  constructor() {
    // Interceptor para añadir el token a todas las solicitudes
    axios.interceptors.request.use(
      (config) => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem("acces_token")}`; // Añadir el token al encabezado
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      response => response,  // Si la respuesta es correcta, la pasa
      error => {
        const originalRequest = error.config;  // La petición original que falló

        // Verificamos si es un error 401 y si ya se ha intentado refrescar el token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;  // Marcamos que ya intentamos refrescar el token
          const refreshToken = localStorage.getItem("refresh_token");  
          return AuthService.refreshToken(refreshToken)  
            .then(response => {
              // Guardamos el nuevo access token
              localStorage.setItem("acces_token", response.data.accessToken);

              // Actualizamos la cabecera de la petición original con el nuevo token
              originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;

              // Reintentar la petición original con el nuevo token
              return axios(originalRequest);
            })
            .catch(refreshError => {
              console.error("Error al refrescar el token", refreshError);
              localStorage.cler();
              window.location.href = "/inicio";  
            });
        }

        return Promise.reject(error);
      }
    );
  }
  
  static getAllReservas(){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/list`);
  }

  static getFechasYaReservadasAnfitrion(anfitrionID){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/fechas/${anfitrionID}`);
  }
  
  static getFechasReservadasViajero(viajeroID){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/fechas/viajero/${viajeroID}`);
  }

  static getIngresoAnfitrion(anfitrionID){
    return axios.get(`${this.RESERVAS_BASE_REST_API_URL}/anfitrion/${anfitrionID}/ingreso`);
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