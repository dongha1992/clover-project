import getCustomDate from '@utils/destination/getCustomDate';
import { IMenus, IMenuDetails, IMenuDetail } from '@model/index';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/ko';

dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

const ONE_WEEK = 7;

export const checkMenuStatus = (menu: IMenus | IMenuDetail) => {
  let { openedAt } = menu;

  // menu 품절 or menu details 모두 품절
  const checkIsAllSold: boolean = menu?.menuDetails
    ?.filter((details) => details.main)
    ?.every((item: IMenuDetails) => item.isSold);

  const checkedMenusAvailiability = () => {
    const mainMenusDetailsLen = menu?.menuDetails?.filter((i) => i.main);
    if (mainMenusDetailsLen?.length < 2) {
      if (mainMenusDetailsLen?.find((i) => i.availability?.availability)?.availability?.availability) {
        return false; // 게속 판매 가능
      } else {
        return true; // 일시 품절 상태
      }
    } else {
      return false;
    }
  };

  const isItemSold = checkIsAllSold || menu.isSold || checkedMenusAvailiability();

  // 오픈 하는지
  const checkIsSoon = (): string => {
    const today = dayjs();
    const diff = dayjs(openedAt).diff(today, 'day', true);

    const isDisplayBadge = diff > 0 && diff <= ONE_WEEK;
    const isBeforeThanLaunchedAt = today.isSameOrBefore(openedAt, 'day');

    try {
      if (isBeforeThanLaunchedAt && isDisplayBadge) {
        const { dayWithTime } = getCustomDate(openedAt);
        return dayWithTime;
      } else {
        return '';
      }
    } catch (error) {
      console.error(error);
    }
    return '';
  };

  const checkIsBeforeThanLaunchAt: string = checkIsSoon();
  return { isItemSold, checkIsBeforeThanLaunchAt };
};
