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

export const getImageUrl = ({ width, url }: { width?: number; url: string }) => {
  const baseUrl = `${process.env.IMAGE_SERVER_URL}/image`;
  return width ? `${baseUrl}/unsafe/${width}x/smart${url}`: `${baseUrl}${url}`;
};
