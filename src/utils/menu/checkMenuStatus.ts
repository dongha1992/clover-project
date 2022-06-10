import getCustomDate from '@utils/destination/getCustomDate';
import { IMenus, IMenuDetails } from '@model/index';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/ko';

dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

export const checkMenuStatus = (menu: IMenus) => {
  const { openedAt } = menu;
  console.log(menu);

  // menu 품절 or menu details 모두 품절
  const checkIsAllSold: boolean = menu.menuDetails
    .filter((details) => details.main)
    .every((item: IMenuDetails) => item.isSold);

  const isItemSold = checkIsAllSold || menu.isSold;

  // 오픈 하는지
  const checkIsSoon = (): string | boolean => {
    const today = dayjs();
    const isBeforeThanLaunchedAt = today.isSameOrBefore(openedAt, 'day');

    try {
      if (isBeforeThanLaunchedAt) {
        const { dayWithTime } = getCustomDate(new Date(openedAt));
        return dayWithTime;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const checkIsBeforeThanLaunchAt: string | boolean = checkIsSoon();
  return { isItemSold, checkIsBeforeThanLaunchAt };
};
