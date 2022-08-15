import { useEffect, useState } from 'react';

const useOrderPrice = (orderMenus: any, orderOptions: any) => {
  const [priceInfo, setPriceInfo] = useState({
    menuPrice: 0,
    menuDiscount: 0,
    menuQuantity: 0,
    deliveryPrice: 0,
    option1: {
      id: 1,
      name: '',
      price: 0,
      quantity: 0,
    },
    option2: {
      id: 2,
      name: '',
      price: 0,
      quantity: 0,
    },
  });

  useEffect(() => {
    const info = {
      menuPrice: 0,
      menuDiscount: 0,
      menuQuantity: 0,
      deliveryPrice: 0,
      option1: {
        id: 1,
        name: '',
        price: 0,
        quantity: 0,
      },
      option2: {
        id: 2,
        name: '',
        price: 0,
        quantity: 0,
      },
    };
    orderMenus?.forEach((menu: any) => {
      info.menuPrice = info.menuPrice + menu.menuPrice;
      info.menuDiscount = info.menuDiscount = info.menuDiscount + menu.menuDiscount;
      info.menuQuantity = info.menuQuantity + menu.menuQuantity;
    });

    orderOptions?.forEach((option: any) => {
      if (option.optionId === 1) {
        if (info.option1.name === '') info.option1.name = option.optionName;
        info.option1.price = info.option1.price + option.optionPrice * option.optionQuantity;
        info.option1.quantity = info.option1.quantity + option.optionQuantity;
      } else if (option.optionId === 2) {
        if (info.option2.name === '') info.option2.name = option.optionName;
        info.option2.price = info.option2.price + option.optionPrice * option.optionQuantity;
        info.option2.quantity = info.option2.quantity + option.optionQuantity;
      }
    });
    const amount = info.menuPrice + info.option2.price + info.option1.price - info.menuDiscount;

    info.deliveryPrice = amount >= 35000 ? 0 : 3500;

    setPriceInfo(info);
  }, [orderMenus, orderOptions]);

  return priceInfo;
};
export default useOrderPrice;
