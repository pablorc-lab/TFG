import axios from "axios";

class AuthService {

  static login(loginRequest) {
    return axios.post("http://localhost:8080/api/auth/login", loginRequest);
  }

  static loginAdmin(loginRequest) {
    return axios.post("http://localhost:8080/api/auth/login-admin", loginRequest);
  }

  static verify(user, loginRequest) {
    return axios.post(`http://localhost:8080/api/auth/verify/${user}`, loginRequest);
  }

  static logout() {
    const token = localStorage.getItem("acces_token");

    return axios.post("http://localhost:8080/api/auth/logout", {}, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => {
        // Si la respuesta es exitosa, borrar el token y otros datos del localStorage
        localStorage.clear();
        console.log("Sesión cerrada exitosamente");
      })
      .catch(error => {
        // Manejar cualquier error
        console.error("Error al cerrar sesión:", error);
      });
  }
}

export default AuthService;