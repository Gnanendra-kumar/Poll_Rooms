import axios from "axios";

export const api = axios.create({
  baseURL: "https://poll-rooms-jyx9.onrender.com/api"
});
