import axios from "axios";

export default axios.create({
  baseURL: "https://interview-test-platform.herokuapp.com/api",
  headers: {
    "Content-type": "application/json",
    "authorization": localStorage.jwtToken
  }
});