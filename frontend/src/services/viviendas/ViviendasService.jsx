import axios from "axios";

class ViviendaService {
  static VIVIENDA_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones";

  static getVivienda(anfitrionID){
    return axios.get(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`);
  }
}

export default ViviendaService;