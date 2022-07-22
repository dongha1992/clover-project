import { IMenuDetailsInCart } from '@model/index';

const checkCartMenuStatus = (menuDetails: IMenuDetailsInCart[]): boolean => {
  console.log(menuDetails, 'checkCartMenuStatus');
  return menuDetails.filter((item) => item.main).every((item) => item.isSold);
};
export default checkCartMenuStatus;
