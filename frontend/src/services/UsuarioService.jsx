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

  static existEmail(email){
    return axios.get(`${this.USUARIO_BASE_REST_API_URL}/existe/${email}`, { auth: this.auth });
  }
}

export default UsuarioService;
