import axios from "axios";

class MatchesService {
  static MATCHES_BASE_REST_API_URL = "http://localhost:8080/api/matches";
  
  static getAll(){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}`);
  }

  static getAfinidad(tipoUser, emisorID){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}/afinidad/${tipoUser}/${emisorID}`);
  }

  static getTwoUsersMatchs(anfitrionID, viajeroID){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}/anfitrion/${anfitrionID}/viajero/${viajeroID}`);
  }

  static getAllViajeros(anfitrionID){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}/anfitrion/${anfitrionID}`);
  }

   static getCantidadAnfitrion(anfitrionID){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}/anfitrion/size/${anfitrionID}`);
  }

  static getAllAnfitriones(viajeroID){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}/viajero/${viajeroID}`);
  }

  static getCantidadViajero(viajeroID){
    return axios.get(`${this.MATCHES_BASE_REST_API_URL}/viajero/size/${viajeroID}`);
  }

  static deleteMatch(matchID){
    return axios.delete(`${this.MATCHES_BASE_REST_API_URL}/eliminar/${matchID}`);
  }

}

export default MatchesService;