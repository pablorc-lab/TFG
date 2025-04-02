import axios from "axios";

class LikesService {
  static LIKES_BASE_REST_API_URL = "http://localhost:8080/api";

  static auth = {
    username: "pablo",
    password: "adminpablo"
  };

  static getAll(){
    return axios.get(`${this.LIKES_BASE_REST_API_URL}/likes`, { auth: this.auth });
  }
  
  static crearLike(tipoUsuario, emisorID, usuarioID){
    return axios.post(`${this.LIKES_BASE_REST_API_URL}/${tipoUsuario}/${emisorID}/${usuarioID}`, { auth: this.auth });
  }
}

export default LikesService;