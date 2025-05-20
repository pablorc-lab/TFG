import axios from "axios";

const VIVIENDA_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones";
class ViviendasService {

  static crearVivienda(anfitrionID, viviendaData) {
    return axios.post(`${VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`, viviendaData);
  }

  static getVivienda(anfitrionID) {
    return axios.get(`${VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`);
  }

  static updateVivienda(anfitrionID, viviendaData) {
    return axios.put(`${VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`, viviendaData);
  }

  // Subir imagen a ImgBB y retornar enlace de la misma
  static uploadImage(image) {
    const formData = new FormData();
    formData.append("image", image);

    return axios.post(`${VIVIENDA_BASE_REST_API_URL}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" }})
      .then(response => response.data.data.url) // Retornar URL de la imagen dentro del JSON
      .catch(error => {
        console.error("Error al subir la imagen:", error);
        return null;
      });
  }
}

export default ViviendasService;