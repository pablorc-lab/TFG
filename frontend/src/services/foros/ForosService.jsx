import axios from "axios";

class ForosService {
  static FOROS_BASE_REST_API_URL = "http://localhost:8080/api";

  // Obtener los foros por cursor (de acuerdo con la última fecha cargada, la primera null)
  static getForosPorCursor(tamanio, ultimaFecha) {
    return axios.get(`${this.FOROS_BASE_REST_API_URL}/foros/paginacion/${tamanio}`, ultimaFecha);
  }

  // Crear un nuevo foro
  static crearForo(tipo_usuario, usuarioID, descripcion) {
    return axios.post(`${this.FOROS_BASE_REST_API_URL}/foros/crear/tipo/${tipo_usuario}/id/${usuarioID}`, descripcion);
  }

  // Eliminar un foro por ID
  static eliminarForo(foroID) {
    return axios.delete(`${this.FOROS_BASE_REST_API_URL}/foros/${foroID}`);
  }
}

export default ForosService;
