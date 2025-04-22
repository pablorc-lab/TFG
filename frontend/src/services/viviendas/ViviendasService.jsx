import axios from "axios";

class ViviendaService {
  static VIVIENDA_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones";

  static crearVivienda(anfitrionID, viviendaData){
    return axios.post(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`, viviendaData);
  }

  static getVivienda(anfitrionID){
    return axios.get(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`);
  }

  static updateVivienda(anfitrionID, viviendaData){
    return axios.put(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`, viviendaData);
  }

}

export default ViviendaService;