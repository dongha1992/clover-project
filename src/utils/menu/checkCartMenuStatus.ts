import { IMenuDetailsInCart } from '@model/index';

// 일별/주별/인당은 다팔려도 품절x -> 다른사람/다른날 살 수 있도 있음, 지정된 날만 못삼
// 판매제한수량(product) or 이벤트수량(menuDetail) -> asis 누적과 동일, 품절상태됨

export const checkCartMenuStatus = (list: IMenuDetailsInCart[]): boolean => {
  return list
    .filter((item) => item.main)
    .some((item) => {
      const exception =
        item.availabilityInfo.menuDetailAvailabilityMessage !== 'PERIOD' &&
        item.availabilityInfo.menuDetailAvailabilityMessage !== 'HOLIDAY';

      if (exception) {
        return !item.availabilityInfo?.availability;
      }
    });
};

export const checkPeriodCartMenuStatus = (list: IMenuDetailsInCart[]): boolean => {
  return list.filter((item) => item.main).some((item) => !item.availabilityInfo?.availability);
};
