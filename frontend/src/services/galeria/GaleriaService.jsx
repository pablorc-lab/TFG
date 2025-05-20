import axios from "axios";

class GaleriaService {
  static GALERIA_BASE_REST_API_URL = "http://localhost:8080/api/viajeros"; // Cambiar la URL base según sea necesario

  // Crear una nueva galería para un usuario
  static crearGaleria(usuarioID, galeriaData) {
    return axios.post(`${GaleriaService.GALERIA_BASE_REST_API_URL}/galeria/crear/${usuarioID}`, galeriaData);
  }

  // Editar la galería de un usuario
  static editarGaleria(usuarioID, galeriaData) {
    return axios.put(`${GaleriaService.GALERIA_BASE_REST_API_URL}/${usuarioID}`, galeriaData);
  }

  // Obtener la galería de un usuario
  static obtenerGaleria(usuarioID) {
    return axios.get(`${GaleriaService.GALERIA_BASE_REST_API_URL}/galeria/${usuarioID}`);
  }

  // Subir una imagen para la galería de un usuario y obtener el enlace
  static uploadImage(image) {
    const formData = new FormData();
    formData.append("image", image);

    return axios.post(`${this.GALERIA_BASE_REST_API_URL}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(response => {
        console.log(response.data);
        return response.data.data.url;
      }) // Retornar URL de la imagen dentro del JSON
      .catch(error => {
        console.error("Error al subir la imagen:", error);
        return null;
      });
  }
}

export default GaleriaService;
