import UsuarioService from "./UsuarioService";

class AnfitrionService extends UsuarioService{ 
  static ANFITRION_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones"

  constructor() {
    super(AnfitrionService.ANFITRION_BASE_REST_API_URL);
  }

 // Métodos específicos de un anfitrion
}

export default new AnfitrionService();