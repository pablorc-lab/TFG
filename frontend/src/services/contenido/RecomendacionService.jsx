import axios from "axios";

class RecomendacionService {
  static crearRecomendacion(anfitrionID, recomendacionData){
    return axios.post(`http://localhost:8080/api/anfitriones/${anfitrionID}/recomendaciones`, recomendacionData);
  }

  static updateRecomendacion(anfitrionID, titulo, recomendacionData){
    return axios.put(`http://localhost:8080/api/anfitriones/${anfitrionID}/recomendaciones/${titulo}`, recomendacionData);
  }

  static deleteRecomendacion(anfitrionID, titulo){
    return axios.delete(`http://localhost:8080/api/anfitriones/${anfitrionID}/recomendaciones/${titulo}`);
  }
}

export default RecomendacionService;