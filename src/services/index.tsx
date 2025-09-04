import axios from 'axios';
let baseUrl = import.meta.env.VITE_API_URL_HTTPS;

if (window.location.hostname === "localhost") {
  baseUrl = import.meta.env.VITE_API_URL_HTTPS;
} else {
  baseUrl = import.meta.env.VITE_API_URL_NUBE;
}
const API = axios.create({
  baseURL: baseUrl,
});

export default API;
