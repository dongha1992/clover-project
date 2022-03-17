import React from 'react';
import styled from 'styled-components';
import CartDisplayItem from './CartDisplayItem';
import CartActualItem from './CartActualItem';

interface handleSelectCartItemIProps {
  handleSelectCartItem: any;
  checkedMenuIdList: any;
  clickPlusButton: any;
  clickMinusButton: any;
  clickRestockNoti: any;
  removeCartItemHandler: any;
  removeCartDisplayItemHandler: any;
  item: any;
}

const CartItem = ({
  handleSelectCartItem,
  checkedMenuIdList,
  clickPlusButton,
  clickMinusButton,
  clickRestockNoti,
  removeCartItemHandler,
  removeCartDisplayItemHandler,
  item,
}: handleSelectCartItemIProps) => {
  return (
    <Container>
      <CartDisplayItem
        handleSelectCartItem={handleSelectCartItem}
        checkedMenuIdList={checkedMenuIdList}
        removeCartDisplayItemHandler={removeCartDisplayItemHandler}
        menu={item}
      />
      {item?.menuDetails.map((menu: any, index: number) => {
        return (
          <CartActualItem
            clickPlusButton={clickPlusButton}
            clickMinusButton={clickMinusButton}
            clickRestockNoti={clickRestockNoti}
            removeCartItemHandler={removeCartItemHandler}
            menu={menu}
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

export default CartItem;
