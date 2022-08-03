import axios from "axios";

export const PublicApi = axios.create({
  baseURL: process.env.API_URL,
});
