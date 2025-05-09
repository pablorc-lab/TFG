import axios from "axios";
import AuthService from "../authentication/AuthService";

class UsuarioService {
  static USUARIO_BASE_REST_API_URL = "http://localhost:8080/api/usuarios"

  constructor(baseUrl) {
    this.baseUrl = baseUrl;

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

  getAll() {
    return axios.get(this.baseUrl);
  }

  getAllPaginacion(pagina, tamanio) {
    return axios.get(`${this.baseUrl}/paginacion/${pagina}/${tamanio}`);
  }

  getAllConDatos() {
    return axios.get(`${this.baseUrl}/datos`);
  }

  create(userData) {
    return axios.post(`${this.baseUrl}/auth/register`, userData);
  }

  getById(userID) {
    return axios.get(`${this.baseUrl}/id/${userID}`);
  }

  getByEmail(email) {
    return axios.get(`${this.baseUrl}/email/${email}`);
  }

  getByPrivateID(privateID) {
    return axios.get(`${this.baseUrl}/private-id/${privateID}`);
  }

  update(userID, userData) {
    return axios.put(`${this.baseUrl}/${userID}`, userData);
  }

  delete(userID) {
    return axios.delete(`${this.baseUrl}/${userID}`);
  }

  static existEmail(email) {
    return axios.get(`${this.USUARIO_BASE_REST_API_URL}/existe/${email}`);
  }

  // Subir imagen a ImgBB y retornar enlace de la misma
  uploadImage(image) {
    const formData = new FormData();
    formData.append("image", image);

    return axios.post(`${this.baseUrl}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" }, auth: this.auth })
      .then(response => response.data.data.url) // Retornar URL de la imagen dentro del JSON
      .catch(error => {
        console.error("Error al subir la imagen:", error);
        return null;
      });
  }
}

export default UsuarioService;
