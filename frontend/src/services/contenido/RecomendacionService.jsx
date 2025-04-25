import axios from "axios";

class RecomendacionService {
  static RECOMENDACION_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones";

  static crearRecomendacion(anfitrionID, recomendacionData){
    return axios.post(`${this.RECOMENDACION_BASE_REST_API_URL}/${anfitrionID}/recomendaciones`, recomendacionData);
  }

  static updateRecomendacion(anfitrionID, titulo, recomendacionData){
    return axios.put(`${this.RECOMENDACION_BASE_REST_API_URL}/${anfitrionID}/recomendaciones/${titulo}`, recomendacionData);
  }

  static deleteRecomendacion(anfitrionID, titulo){
    return axios.delete(`${this.RECOMENDACION_BASE_REST_API_URL}/${anfitrionID}/recomendaciones/${titulo}`);
  }
}

export default RecomendacionService;