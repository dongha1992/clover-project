import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleHTTPError } from './errorHandle';

export const ImageApi = axios.create({
  baseURL: 'https://image-dev.freshcode.me',
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'image/jpeg',
  },
});

ImageApi.interceptors.response.use(
  (res) => {
    return res;
  },
  (error: AxiosError) => {
    return handleHTTPError(error as AxiosError);
  }
);

ImageApi.interceptors.request.use((req) => {
  req.headers = {
    ...req.headers,
  };
  return req;
});

export const postImageApi = (formData: any) => {
  return ImageApi.post('/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getImageApi = () => {
  return ImageApi.get('/image/unsafe/300x/smart');
};
