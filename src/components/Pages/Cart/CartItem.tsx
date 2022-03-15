import React from 'react';
import styled from 'styled-components';
import BorderLine from '@components/Shared/BorderLine';
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

      <BorderLine height={1} margin="16px 0" />
    </Container>
  );
};

const Container = styled.div`
  .itemCheckbox {
    display: flex;
    width: 100%;
    > div {
      align-self: flex-start;
      padding-right: 9px;
    }
  }
  .itemInfo {
    padding-left: 30px;
  }
`;

export default CartItem;
