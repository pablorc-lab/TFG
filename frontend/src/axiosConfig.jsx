import axios from "axios";
import AuthService from "./services/authentication/AuthService";

// Este interceptor de Axios se ejecuta automáticamente antes de que cualquier petición HTTP sea enviada, 
// modificando su configuración para incluir el token de autenticación JWT en los headers bajo la clave 
// 'Authorization' con el formato estándar Bearer [token], donde el token se obtiene del localStorage con la 
// clave "acces_token" garantizando que todas las solicitudes salientes lleven el token de autenticación necesario 
// para que el backend valide la identidad del usuario, mientras que en caso de error durante este proceso, 
// rechaza inmediatamente la promesa para manejar el fallo adecuadamente en la cadena de promesas de Axios.
axios.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem("acces_token")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejar el refresh token si se devuelve un error 401
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
          localStorage.clear();
          window.location.href = "/inicio";
        });
    }

    return Promise.reject(error);
  }
);