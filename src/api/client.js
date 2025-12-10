// src/api/client.js
import axios from "axios";

const client = axios.create({
  // 백엔드 주소 매핑
  baseURL: "http://localhost:9090", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
