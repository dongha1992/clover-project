export const getValues = (obj: any, key: string): string | undefined => {
  return obj === null ? undefined : obj[key];
};
