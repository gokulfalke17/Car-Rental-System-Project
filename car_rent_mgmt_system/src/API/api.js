import axios from "axios";

const BASE_URL = "http://localhost:4041"; 
export default axios.create({
  baseURL: BASE_URL,
});
