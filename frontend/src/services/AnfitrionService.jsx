import axios from "axios"

const ANFITRION_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones"

class AnfitrionService{
  getAllAnfitriones(){
    return axios.get(ANFITRION_BASE_REST_API_URL);
  }
  
  createAnfitrion(anfitrion){
    return axios.post(ANFITRION_BASE_REST_API_URL, anfitrion);
  }

  getAnfitrionByID(anfitrionID){
    return axios.get(ANFITRION_BASE_REST_API_URL + "/" + anfitrionID);
  }

  updateAnfitrion(anfitrionID, anfitrion){
    return axios.put(ANFITRION_BASE_REST_API_URL + "/" + anfitrionID, anfitrion)
  }

  deleteAnfitrionByID(anfitrionID){
    return axios.delete(ANFITRION_BASE_REST_API_URL + "/" + anfitrionID);
  }
}

export default new AnfitrionService();