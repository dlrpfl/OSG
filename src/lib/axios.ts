import axios, { AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = async <T = unknown>(
  url: string,
  data?: unknown
): Promise<AxiosResponse<T>> => {
  return instance.post<T>(url, data);
};

export default api;
