import UsuarioService from "./UsuarioService";
import axios from "axios";
import AuthService from "../authentication/AuthService";

class ViajeroService extends UsuarioService {
  static VIAJERO_BASE_REST_API_URL = "http://localhost:8080/api/viajeros"

  constructor() {
    super(ViajeroService.VIAJERO_BASE_REST_API_URL);
    
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

  // Métodos específicos de un viajero
  getViajerosFiltrados(filtros, pagina, tamanio){
    return axios.post(`${this.baseUrl}/filtrar/${pagina}/${tamanio}`, filtros);
  }
}

export default new ViajeroService();


