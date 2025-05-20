import axios from "axios";

const BIOGRAFIAS_BASE_REST_API_URL = "http://localhost:8080/api";

class BiografiasService {
  static getAll(tipo_usuario) {
    return axios.get(`${BIOGRAFIAS_BASE_REST_API_URL}/${tipo_usuario}/biografias/list`);
  }

  static crear(tipo_usuario, userID, biografiaData) {
    return axios.post(`${BIOGRAFIAS_BASE_REST_API_URL}/${tipo_usuario}/${userID}/biografia`, biografiaData);
  }

  static update(tipo_usuario, userID, biografiaData) {
    return axios.put(`${BIOGRAFIAS_BASE_REST_API_URL}/${tipo_usuario}/${userID}/biografia`, biografiaData);
  }
}

export default BiografiasService;