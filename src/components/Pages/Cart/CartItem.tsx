import React from 'react';
import styled from 'styled-components';
import CartDisplayItem from './CartDisplayItem';
import CartActualItem from './CartActualItem';
import { IGetCart, IMenuDetailsInCart } from '@model/index';
interface handleSelectCartItemIProps {
  selectCartItemHandler: (menu: IGetCart) => void;
  clickPlusButton: (menuDetailId: number, quantity: number) => void;
  clickMinusButton: (menuDetailId: number, quantity: number) => void;
  removeCartActualItemHandler: ({
    menuDetailId,
    menuId,
    cartId,
  }: {
    menuId: number;
    menuDetailId: number;
    cartId: number;
  }) => void;
  removeCartDisplayItemHandler: (menu: IGetCart) => void;
  checkedMenus: IGetCart[];
  menu: IGetCart;
}

const CartItem = ({
  selectCartItemHandler,
  checkedMenus,
  clickPlusButton,
  clickMinusButton,
  removeCartActualItemHandler,
  removeCartDisplayItemHandler,
  menu,
}: handleSelectCartItemIProps) => {
  return (
    <Container>
      <CartDisplayItem
        selectCartItemHandler={selectCartItemHandler}
        checkedMenus={checkedMenus}
        removeCartDisplayItemHandler={removeCartDisplayItemHandler}
        menu={menu}
      />
      {menu?.menuDetails.map((menuDetail: IMenuDetailsInCart, index: number) => {
        return (
          <CartActualItem
            key={index}
            clickPlusButton={clickPlusButton}
            clickMinusButton={clickMinusButton}
            removeCartActualItemHandler={removeCartActualItemHandler}
            menuDetail={menuDetail}
            menuId={menu?.menuId!}
            holiday={menuDetail.holiday}
            menuName={menu.name}
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
