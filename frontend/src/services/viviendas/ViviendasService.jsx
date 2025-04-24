import axios from "axios";

class ViviendasService {
  static VIVIENDA_BASE_REST_API_URL = "http://localhost:8080/api/anfitriones";

  static crearVivienda(anfitrionID, viviendaData) {
    return axios.post(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`, viviendaData);
  }

  static getVivienda(anfitrionID) {
    return axios.get(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`);
  }

  static updateVivienda(anfitrionID, viviendaData) {
    return axios.put(`${this.VIVIENDA_BASE_REST_API_URL}/${anfitrionID}/vivienda`, viviendaData);
  }

  // Subir imagen a ImgBB y retornar enlace de la misma
  static uploadImage(image) {
    const formData = new FormData();
    formData.append("image", image);

    return axios.post(`${this.VIVIENDA_BASE_REST_API_URL}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" }, auth: this.auth })
      .then(response => response.data.data.url) // Retornar URL de la imagen dentro del JSON
      .catch(error => {
        console.error("Error al subir la imagen:", error);
        return null;
      });
  }
}

export default ViviendasService;