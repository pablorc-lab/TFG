class RecomendacionService {
  static RECOMENDACION_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones";

  static crearRecomendacion(anfitrionID, recomendacionData){
    return axios.post(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/recomendaciones`, recomendacionData);
  }

  static updateRecomendacion(anfitrionID, recomendacionData){
    return axios.put(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/recomendaciones`, recomendacionData);
  }

}

export default RecomendacionService;