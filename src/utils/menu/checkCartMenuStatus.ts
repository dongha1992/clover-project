import { IMenuDetailsInCart } from '@model/index';

// 일별/주별/인당은 다팔려도 품절x -> 다른사람/다른날 살 수 있도 있음, 지정된 날만 못삼
// 판매제한수량(product) or 이벤트수량(menuDetail) -> asis 누적과 동일, 0개 되면 품절

const checkCartMenuStatus = (menuDetails: IMenuDetailsInCart[]): boolean => {
  const single = menuDetails.length > 1;

  return menuDetails.filter((item) => item.main).some((item) => item.availabilityInfo?.availability);
};
export default checkCartMenuStatus;
