import React from 'react';
import styled from 'styled-components';
import CartDisplayItem from './CartDisplayItem';
import CartActualItem from './CartActualItem';

interface handleSelectCartItemIProps {
  handleSelectCartItem: (id: number) => void;
  checkedMenuIdList: number[];
  clickPlusButton: (id: number, quantity: number) => void;
  clickMinusButton: (id: number, quantity: number) => void;
  clickRestockNoti: any;
  removeCartActualItemHandler: ({ id, main }: { id: number; main: boolean }) => void;
  removeCartDisplayItemHandler: (id: number) => void;
  item: any;
}

const CartItem = ({
  handleSelectCartItem,
  checkedMenuIdList,
  clickPlusButton,
  clickMinusButton,
  clickRestockNoti,
  removeCartActualItemHandler,
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
      {item?.menuDetails.map((menuDetail: any, index: number) => {
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

export default CartItem;
