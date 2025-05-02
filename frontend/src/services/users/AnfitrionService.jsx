import UsuarioService from "./UsuarioService";
import axios from "axios";

class AnfitrionService extends UsuarioService {
  static ANFITRION_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones"

  constructor() {
    super(AnfitrionService.ANFITRION_BASE_REST_API_URL);
  }

  // Obtener anfitriones según ciertos filtros
  getAnfitrionesFiltrados(filtros){
    return axios.post(`${this.baseUrl}/filtrar`, filtros);
  }

  eliminarVivienda(anfitrionID) {
    return axios.delete(`${this.baseUrl}/${anfitrionID}/vivienda`);
  }

}

export default new AnfitrionService();