import axios from "axios";

class ValoracionesService {
  static VALORACIONES_BASE_REST_API_URL = "http://localhost:8080/api";
  
  static getAll() {
    return axios.get(`${this.VALORACIONES_BASE_REST_API_URL}/valoraciones/all`);
  }

  static obtenerValoracionEstado(tipo_usuario, usuarioID, receptoresIDs) {
    return axios.post(`${this.VALORACIONES_BASE_REST_API_URL}/${tipo_usuario}/${usuarioID}/valoraciones/estado`, receptoresIDs);
  }

  static obtenerValoracionesEnviadas(tipo_usuario, usuarioID) {
    return axios.get(`${this.VALORACIONES_BASE_REST_API_URL}/${tipo_usuario}/${usuarioID}/valoraciones/enviadas`);
  }

  static obtenerValoracionesRecibidas(tipo_usuario, usuarioID) {
    return axios.get(`${this.VALORACIONES_BASE_REST_API_URL}/${tipo_usuario}/${usuarioID}/valoraciones/recibidas`);
  }

  static crearValoracion(tipo_usuario, emisorID, receptorID, valoracion) {
    return axios.post(`${this.VALORACIONES_BASE_REST_API_URL}/${tipo_usuario}/${emisorID}/valoraciones/${receptorID}`, valoracion);
  }
}

export default ValoracionesService;