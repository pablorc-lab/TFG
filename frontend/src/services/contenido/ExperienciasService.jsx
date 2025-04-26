import axios from "axios";

class ExperienciaService {
  static crearExperiencia(viajeroID, experienciaData){
    return axios.post(`http://localhost:8080/api/viajeros/${viajeroID}/experiencias`, experienciaData);
  }

  static updateExperiencia(viajeroID, titulo, experienciaData){
    return axios.put(`http://localhost:8080/api/viajeros/${viajeroID}/experiencias/${titulo}`, experienciaData);
  }

  static deleteExperiencia(viajeroID, titulo){
    return axios.delete(`http://localhost:8080/api/viajeros/${viajeroID}/experiencias/${titulo}`);
  }
}

export default ExperienciaService;