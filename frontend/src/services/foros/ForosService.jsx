import axios from "axios";

class ForosService {
  static FOROS_BASE_REST_API_URL = "http://localhost:8080/api/foros";

  // Obtener los foros por cursor (de acuerdo con la última fecha cargada, la primera null)
  static getForosPorCursor(paginacion, tamanio, ultimaFecha) {
    return axios.get(`${this.FOROS_BASE_REST_API_URL}/paginacion/${paginacion}/${tamanio}`, ultimaFecha);
  }

  // Obtener las respuestas de un foro padre
  static getRespuestas(foroPadreID){
    return axios.get(`${this.FOROS_BASE_REST_API_URL}/respuestas/${foroPadreID}`);
  }
  // Crear un nuevo foro
  static crearForo(tipo_usuario, usuarioID, descripcion) {
    return axios.post(`${this.FOROS_BASE_REST_API_URL}/crear`, {tipoUsuario: tipo_usuario, usuarioID: usuarioID, descripcion: descripcion});
  }

  // Crear una nueva respueta a un foro padre
  static crearRespuesta(foroPadreID, tipo_usuario, usuarioID, descripcion) {
    return axios.post(`${this.FOROS_BASE_REST_API_URL}/crear/respuesta/padre/${foroPadreID}`, {tipoUsuario: tipo_usuario, usuarioID: usuarioID, descripcion: descripcion});
  }

  // Eliminar un foro por ID
  static eliminarForo(foroID) {
    return axios.delete(`${this.FOROS_BASE_REST_API_URL}/${foroID}`);
  }
}

export default ForosService;
