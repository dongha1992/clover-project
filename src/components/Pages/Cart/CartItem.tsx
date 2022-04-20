import React from 'react';
import styled from 'styled-components';
import CartDisplayItem from './CartDisplayItem';
import CartActualItem from './CartActualItem';
import { IGetCart, IMenuDetailsInCart } from '@model/index';
interface handleSelectCartItemIProps {
  handleSelectCartItem: (menu: IGetCart) => void;
  checkedMenus: IGetCart[];
  clickPlusButton: (id: number, quantity: number) => void;
  clickMinusButton: (id: number, quantity: number) => void;
  clickRestockNoti: any;
  removeCartActualItemHandler: ({ id, main }: { id: number; main: boolean }) => void;
  removeCartDisplayItemHandler: (menu: IGetCart) => void;
  menu: IGetCart;
}

const CartItem = ({
  handleSelectCartItem,
  checkedMenus,
  clickPlusButton,
  clickMinusButton,
  clickRestockNoti,
  removeCartActualItemHandler,
  removeCartDisplayItemHandler,
  menu,
}: handleSelectCartItemIProps) => {
  return (
    <Container>
      <CartDisplayItem
        handleSelectCartItem={handleSelectCartItem}
        checkedMenus={checkedMenus}
        removeCartDisplayItemHandler={removeCartDisplayItemHandler}
        menu={menu}
      />
      {menu?.menuDetails.map((menuDetail: IMenuDetailsInCart, index: number) => {
        return (
          <CartActualItem
            clickPlusButton={clickPlusButton}
            clickMinusButton={clickMinusButton}
            clickRestockNoti={clickRestockNoti}
            removeCartActualItemHandler={removeCartActualItemHandler}
            menuDetail={menuDetail}
            key={index}
          />
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 24px;
`;

export default React.memo(CartItem);
