import { useEffect, useState } from 'react';

const useOptionsPrice = (orderDeliveries: any) => {
  const [optionsPrice, setOptionsPrice] = useState({
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
    const data = {
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

    orderDeliveries?.forEach((order: any) => {
      order?.orderOptions?.forEach((o: any) => {
        if (o.optionId === 1) {
          if (data.option1.name === '') data.option1.name = o.optionName;
          data.option1.price = data.option1.price + o.optionPrice;
          data.option1.quantity = data.option1.quantity + o.optionQuantity;
        }
        if (o.optionId === 2) {
          if (data.option2.name === '') data.option2.name = o.optionName;
          data.option2.price = data.option2.price + o.optionPrice;
          data.option2.quantity = data.option2.quantity + o.optionQuantity;
        }
      });
    });

    setOptionsPrice(data);
  }, [orderDeliveries]);

  return optionsPrice;
};
export default useOptionsPrice;
