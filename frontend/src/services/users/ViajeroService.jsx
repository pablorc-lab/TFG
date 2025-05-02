import UsuarioService from "./UsuarioService";
import axios from "axios";

class ViajeroService extends UsuarioService {
  static VIAJERO_BASE_REST_API_URL = "http://localhost:8080/api/viajeros"

  constructor() {
    super(ViajeroService.VIAJERO_BASE_REST_API_URL);
  }

  // Métodos específicos de un viajero
  getViajerosFiltrados(filtros){
    return axios.post(`${this.baseUrl}/filtrar`, filtros);
  }
}

export default new ViajeroService();


