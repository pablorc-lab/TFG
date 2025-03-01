import axios from "axios"

export default function ImageUploader({ file }) {
  if (!file) return Promise.resolve(null);

  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", import.meta.env.VITE_IMGBB_API_KEY);

  return axios.post("https://api.imgbb.com/1/upload", formData, { headers: { "Content-Type": "multipart/form-data" }, })
    .then(response => {
      const imageUrl = response.data.data.url;
      console.log("Imagen subida:", imageUrl);
      return imageUrl;
    })
    .catch(error => {
      console.error("Error al subir la imagen:", error);
      return null;
    });
}
