export const getFormatTime = (t: number) => (t < 10 ? '0' + t : t + '');
export const getFormatTimeStr = (mm: number, ss: number) => {
  return `${getFormatTime(mm)}:${getFormatTime(ss)}`;
};
