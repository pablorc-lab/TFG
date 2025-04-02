import axios from "axios";

class MatchesService {
  static MATCHES_BASE_REST_API_URL = "http://localhost:8080/api/matches";

  static auth = {
    username: "pablo",
    password: "adminpablo"
  };

  static getAll(){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}`, { auth: this.auth });
  }

  static eliminarMatch(matchID){
    return axios.delete(`${this.MATCHES_BASE_REST_API_URL}/eliminar/${matchID}`, { auth: this.auth });
  }

  static getAllViajeros(anfitrionID){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}/anfitrion/${anfitrionID}`, { auth: this.auth });
  }
}

export default MatchesService;