import axios from "axios";
import AuthService from "../authentication/AuthService";

class ForosService {
  static FOROS_BASE_REST_API_URL = "http://localhost:8080/api/foros";

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
  
  // Obtener los foros por cursor (de acuerdo con la última fecha cargada, la primera null)
  static getForosPorCursor(paginacion, tamanio, ultimaFecha) {
    return axios.get(`${this.FOROS_BASE_REST_API_URL}/paginacion/${paginacion}/${tamanio}`, ultimaFecha);
  }

  // Obtener las respuestas de un foro padre
  static getRespuestas(foroPadreID){
    return axios.get(`${this.FOROS_BASE_REST_API_URL}/respuestas/${foroPadreID}`);
  }
  // Crear un nuevo foro
  static crearForo(tipo_usuario, usuarioID, descripcion) {
    return axios.post(`${this.FOROS_BASE_REST_API_URL}/crear`, {tipoUsuario: tipo_usuario, usuarioID: usuarioID, descripcion: descripcion});
  }

  // Crear una nueva respueta a un foro padre
  static crearRespuesta(foroPadreID, tipo_usuario, usuarioID, descripcion) {
    return axios.post(`${this.FOROS_BASE_REST_API_URL}/crear/respuesta/padre/${foroPadreID}`, {tipoUsuario: tipo_usuario, usuarioID: usuarioID, descripcion: descripcion});
  }

  // Eliminar un foro por ID
  static eliminarForo(foroID) {
    return axios.delete(`${this.FOROS_BASE_REST_API_URL}/${foroID}`);
  }
}

export default ForosService;
