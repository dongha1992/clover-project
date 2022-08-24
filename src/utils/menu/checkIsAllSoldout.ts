import { IMenuDetailsInCart } from '@model/index';

const checkIsAllSoldout = (menuDetails: IMenuDetailsInCart[]): boolean => {
  return menuDetails.filter((item) => item.main).every((item) => item.isSold);
};
export default checkIsAllSoldout;
