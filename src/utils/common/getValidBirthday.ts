import { IBirthdayObj } from '@pages/signup/optional';

const getValidBirthday = (birthDayObj: IBirthdayObj) => {
  const AGES = 13;

  const today = new Date();
  const curYear = today.getFullYear();
  const curMonth = today.getMonth() + 1;
  const curDate = today.getDate();

  const vaildYear = curYear - AGES;

  if (birthDayObj.year === vaildYear) {
    const sameMonth = birthDayObj.month >= 0 && birthDayObj.month === curMonth;
    if (sameMonth) {
      const dayCheck = birthDayObj.day > 0 && birthDayObj.day < curDate;
      if (dayCheck) {
        return true;
      } else {
        return false;
      }
    }

    const monthCheck = birthDayObj.month >= 0 && birthDayObj.month < curMonth;
    if (monthCheck) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export default getValidBirthday;
