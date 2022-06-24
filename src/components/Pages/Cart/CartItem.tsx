import React from 'react';
import styled from 'styled-components';
import CartDisplayItem from './CartDisplayItem';
import CartActualItem from './CartActualItem';
import { IGetCart, IMenuDetailsInCart } from '@model/index';
interface handleSelectCartItemIProps {
  handleSelectCartItem: (menu: IGetCart) => void;
  checkedMenus: IGetCart[];
  clickPlusButton: (menuDetailId: number, quantity: number) => void;
  clickMinusButton: (menuDetailId: number, quantity: number) => void;
  clickRestockNoti: any;
  removeCartActualItemHandler: ({
    menuDetailId,

    menuId,
  }: {
    menuId: number;

    menuDetailId: number;
  }) => void;
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
  console.log(menu, 'menu');
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
            menuId={menu.menuId}
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
