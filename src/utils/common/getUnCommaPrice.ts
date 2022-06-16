const getUnCommaPrice = (val: string): string | number => {
  let str = val;
  return str.replace(/[^\d]+/g, '');
};
export default getUnCommaPrice;
