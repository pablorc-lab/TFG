import axios from "axios";

class UsuarioService {
  static USUARIO_BASE_REST_API_URL = "http://localhost:8080/api/usuarios"

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
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
    return axios.put(`${this.baseUrl}/id/${userID}`, userData);
  }

  delete(userID) {
    return axios.delete(`${this.baseUrl}/id/${userID}`);
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
