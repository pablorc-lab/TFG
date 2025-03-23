import axios from "axios";

class UsuarioService {
  static USUARIO_BASE_REST_API_URL = "http://localhost:8080/api/usuarios"

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.auth = {
      username: "pablo",
      password: "adminpablo"
    };
  }

  getAll() {
    return axios.get(this.baseUrl, { auth: this.auth });
  }

  getAllConDatos() {
    return axios.get(`${this.baseUrl}/datos`, { auth: this.auth });
  }

  create(userData) {
    return axios.post(this.baseUrl, userData, { auth: this.auth });
  }

  getById(userID) {
    return axios.get(`${this.baseUrl}/${userID}`, { auth: this.auth });
  }

  update(userID, userData) {
    return axios.put(`${this.baseUrl}/${userID}`, userData, { auth: this.auth });
  }

  delete(userID) {
    return axios.delete(`${this.baseUrl}/${userID}`, { auth: this.auth });
  }

  static existEmail(email) {
    return axios.get(`${this.USUARIO_BASE_REST_API_URL}/existe/${email}`, { auth: this.auth });
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
