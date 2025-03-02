import axios from "axios"

// Sube una imagen a ImgBB y devuelve la URL
// Tambien permite eliminarlas, dada su deleteURL
export default function ImageUploader({ file }) {
  if (!file) return Promise.resolve(null);
  
  const formData = new FormData(); // Datos en formato "multipart/form-data"
  formData.append("image", file);
  formData.append("key", import.meta.env.VITE_IMGBB_API_KEY);

  return axios.post("https://api.imgbb.com/1/upload", formData, { headers: { "Content-Type": "multipart/form-data" }, })
    .then(response => {
      const imageUrl = response.data.data.url;
      const deleteUrl = response.data.data.delete_url;
      console.log("Imagen subida:", imageUrl);
      console.log("URL para eliminar:", deleteUrl);
      return {imageUrl, deleteUrl};
    })
    .catch(error => {
      console.error("Error al subir la imagen:", error);
      return null;
    });
}
