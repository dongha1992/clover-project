const getImageSize = (img: any, maxWidth: number, maxHeight: number) => {
  let width = img.width;
  let height = img.height;

  // 가로로 길 때
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
};
export default getImageSize;
