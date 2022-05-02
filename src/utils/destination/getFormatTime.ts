const getFormatTime = (t: number) => (t < 10 ? '0' + t : t + '');
const getFormatTimeStr = (mm: number, ss: number) => {
  return `${getFormatTime(mm)}:${getFormatTime(ss)}`;
};

export { getFormatTime, getFormatTimeStr };
