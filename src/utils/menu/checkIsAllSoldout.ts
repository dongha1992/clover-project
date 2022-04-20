import { IMenuDetailsInCart } from '@model/index';

const checkIsAllSoldout = (menuDetails: IMenuDetailsInCart[]): boolean => {
  menuDetails = [
    { main: true, isSold: false },
    { main: false, isSold: true },
    { main: true, isSold: true },
  ];
  return menuDetails.filter((item) => item.main).every((item) => !item.isSold);
};
export default checkIsAllSoldout;
