import axios from 'axios';

export const ImageApi = axios.create({
  baseURL: process.env.IMAGE_SERVER_URL,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'image/jpeg',
  },
});

export const postImageApi = (formData: any) => {
  return ImageApi.post('/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
