import axios from "axios";

class LikesService {
  static LIKES_BASE_REST_API_URL = "http://localhost:8080/api";

  static getAll(){
    return axios.get(`${this.LIKES_BASE_REST_API_URL}/likes`);
  }
  
  static getAllEnviados(tipoUsuario, emisorID){
    return axios.get(`${this.LIKES_BASE_REST_API_URL}/${tipoUsuario}/${emisorID}/likes/enviados`);
  }

  static getAllViajerosRecibidos(receptorID){
    return axios.get(`${this.LIKES_BASE_REST_API_URL}/anfitriones/${receptorID}/likes/recibidos`);
  }

  static haDadoLike(tipoUsuario, emisorID, receptorID) {
    return axios.get(`${this.LIKES_BASE_REST_API_URL}/${tipoUsuario}/${emisorID}/likes/${receptorID}/existe`)
  };

  static crearLike(tipoUsuario, emisorID, usuarioID){
    return axios.post(`${this.LIKES_BASE_REST_API_URL}/${tipoUsuario}/${emisorID}/likes/${usuarioID}`);
  }

  // tipoUsuario es el tipo que ha dado like al usuarioID, es decir enviar el contrario al almacenado
  static deleteLike(tipoUsuario, emisorID, usuarioID){
    return axios.delete(`${this.LIKES_BASE_REST_API_URL}/${tipoUsuario}/${emisorID}/likes/${usuarioID}`);
  }
}

export default LikesService;