export const days = ['일', '월', '화', '수', '목', '금', '토'];

export const dayFormatter = (inputDate: Date) => {
  const originalDate = new Date(inputDate);

  let month = `${originalDate.getMonth() + 1}`;
  let date = `${originalDate.getDate()}`;
  const day = days[originalDate.getDay()];

  if (month.length === 1) month = `0${month}`;
  if (date.length === 1) date = `0${date}`;

  return `${month}.${date} (${day})`;
};

export const dayFormatterHyphen = (inputDate: Date) => {
  const originalDate = new Date(inputDate);

  const year = `${originalDate.getFullYear()}`;
  let month = `${originalDate.getMonth() + 1}`;
  let date = `${originalDate.getDate()}`;

  if (month.length === 1) month = `0${month}`;
  if (date.length === 1) date = `0${date}`;

  return `${year}-${month}-${date}`;
};
