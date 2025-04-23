import UsuarioService from "./UsuarioService";
import axios from "axios";

class AnfitrionService extends UsuarioService {
  static ANFITRION_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones"

  constructor() {
    super(AnfitrionService.ANFITRION_BASE_REST_API_URL);
  }

  // Métodos específicos de un anfitrion
  getViviendasPorUbicacion(ciudad, provincia) {
    return axios.get(`${this.baseUrl}/viviendas/${ciudad}-${provincia}`);
  }

  eliminarVivienda(anfitrionID) {
    return axios.delete(`${this.baseUrl}/${anfitrionID}/vivienda`);
  }

}

export default new AnfitrionService();