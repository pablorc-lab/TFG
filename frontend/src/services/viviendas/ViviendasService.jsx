import axios from "axios";
import AuthService from "../authentication/AuthService";

class ViviendasService {
  static VIVIENDA_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones";

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
  
  static crearVivienda(anfitrionID, viviendaData) {
    return axios.post(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`, viviendaData);
  }

  static getVivienda(anfitrionID) {
    return axios.get(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`);
  }

  static updateVivienda(anfitrionID, viviendaData) {
    return axios.put(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`, viviendaData);
  }

  // Subir imagen a ImgBB y retornar enlace de la misma
  static uploadImage(image) {
    const formData = new FormData();
    formData.append("image", image);

    return axios.post(`${this.VIVIENDA_BASE_REST_API_URL}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" }, auth: this.auth })
      .then(response => response.data.data.url) // Retornar URL de la imagen dentro del JSON
      .catch(error => {
        console.error("Error al subir la imagen:", error);
        return null;
      });
  }
}

export default ViviendasService;