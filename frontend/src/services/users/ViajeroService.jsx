import UsuarioService from "./UsuarioService";

class ViajeroService extends UsuarioService {
  static VIAJERO_BASE_REST_API_URL = "http://localhost:8080/api/viajeros"

  constructor() {
    super(ViajeroService.VIAJERO_BASE_REST_API_URL);
  }

  // Métodos específicos de un viajero
}

export default new ViajeroService();


