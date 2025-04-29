import axios from "axios";

class AuthService {

  static login(loginRequest){
    return axios.post("http://localhost:8080/api/auth/login", loginRequest);
  }

  static verify(user, loginRequest){
    return axios.post(`http://localhost:8080/api/auth/verify/${user}`, loginRequest);
  }
}

export default AuthService;