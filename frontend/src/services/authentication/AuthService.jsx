import axios from "axios";

class AuthService {

  static login(loginRequest){
    return axios.post("http://localhost:8080/api/auth/login", loginRequest);
  }

  static verify(loginRequest){
    return axios.post("http://localhost:8080/api/auth/verify", loginRequest);
  }
}

export default AuthService;