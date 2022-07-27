import { IMenuDetailsInCart } from '@model/index';

const checkIsAllSoldout = (menuDetails: IMenuDetailsInCart[]): boolean => {
  console.log(menuDetails, 'checkIsAllSoldout');
  return menuDetails.filter((item) => item.main).every((item) => item.isSold);
};
export default checkIsAllSoldout;
