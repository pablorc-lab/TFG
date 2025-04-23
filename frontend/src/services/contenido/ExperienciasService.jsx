class ExperienciaService {
  static EXPERIENCIAS_BASE_REST_API_URL = "http://localhost:8080/api/viajeros";

  static crearExperiencia(viajeroID, experienciaData){
    return axios.post(`${this.VIVIENDA_BASE_REST_API_URL}/${viajeroID}/experiencias`, experienciaData);
  }

  static updateExperiencia(viajeroID, experienciaData){
    return axios.put(`${this.VIVIENDA_BASE_REST_API_URL}/${viajeroID}/experiencias`, experienciaData);
  }

}

export default ExperienciaService;