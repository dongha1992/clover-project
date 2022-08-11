import NextImage from 'next/image';
import { ImageLoaderProps, ImageProps } from 'next/dist/client/image';
import { useEffect, useState } from 'react';
import { IMAGE_ERROR } from '@constants/menu';

const thumborLoader = (props: ImageLoaderProps): string => {
  return `${process.env.IMAGE_SERVER_URL}/unsafe/${props.width}x/smart${props.src}`;
};

const Image = (props: ImageProps) => {
  const { src, ...nextImageProps } = props;
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <>
      {imageSrc && (
        <NextImage loader={thumborLoader} src={imageSrc} {...nextImageProps} onError={() => setImageSrc(IMAGE_ERROR)} />
      )}
    </>
  );
};

export default Image;
