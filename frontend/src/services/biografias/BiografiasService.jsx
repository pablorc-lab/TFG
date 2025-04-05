import axios from "axios";

class BiografiasService {
  static BIOGRAFIAS_BASE_REST_API_URL = "http://localhost:8080/api";

  auth = {
    username: "pablo",
    password: "adminpablo"
  };

  static getAll(tipo_usuario){
    return axios.get(`${this.BIOGRAFIAS_BASE_REST_API_URL}/${tipo_usuario}/biografias/list`, { auth: this.auth });
  }
}

export default BiografiasService;