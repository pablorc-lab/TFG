import axios from "axios";

class BiografiasService {
  static BIOGRAFIAS_BASE_REST_API_URL = "http://localhost:8080/api";

  static getAll(tipo_usuario){
    return axios.get(`${this.BIOGRAFIAS_BASE_REST_API_URL}/${tipo_usuario}/biografias/list`);
  }
}

export default BiografiasService;