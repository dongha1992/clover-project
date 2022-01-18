import React, { useState } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { Select, MenuOption } from '@components/Shared/Dropdown';
import { theme, bottomSheetButton } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { useSelector, useDispatch } from 'react-redux';
import { cartForm, SET_CART_LISTS } from '@store/cart';
import CartSheetItem from './CartSheetItem';
import { Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useToast } from '@hooks/useToast';

const CartSheet = () => {
  const [selectedMenus, setSelectedMenus] = useState<any>([]);
  const { showToast } = useToast();

  const dispatch = useDispatch();
  const { cartSheetObj } = useSelector(cartForm);

  const selectMenuHandler = (menu: any) => {
    setSelectedMenus([...selectedMenus, menu]);
  };

  const submitHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
    dispatch(SET_CART_LISTS(selectedMenus));
    setTimeout(() => {
      showToast({ message: '장바구니에 담겼습니다.' });
    }, 500);
  };

  // TODO: cartSheetObj 가끔 못 찾음 원인 파악

  if (!Object.keys(cartSheetObj).length) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        옵션 선택
      </TextH5B>
      <Wrapper>
        <MainOption>
          <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
            필수옵션
          </TextH5B>
          <Select placeholder="필수옵션" type={'main'}>
            {cartSheetObj?.main.map((option: any, index: number) => (
              <MenuOption
                key={index}
                option={option}
                selectMenuHandler={selectMenuHandler}
              />
            ))}
          </Select>
        </MainOption>
        <OptionalOption>
          {cartSheetObj?.secondary.length > 0 ? (
            <>
              <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
                선택옵션
              </TextH5B>
              <Select placeholder="선택옵션" type={'optional'}>
                {cartSheetObj?.secondary.map((option: any, index: number) => (
                  <MenuOption
                    key={index}
                    option={option}
                    selectMenuHandler={selectMenuHandler}
                  />
                ))}
              </Select>
            </>
          ) : null}
        </OptionalOption>
        {selectedMenus.length > 0 ? (
          <SelectedCartItemContainer>
            {selectedMenus.map((menu: any, index: number) => (
              <CartSheetItem menu={menu} key={index} padding="16px" />
            ))}
          </SelectedCartItemContainer>
        ) : null}
      </Wrapper>
      <OrderInfoContainer>
        <TotalSumContainer>
          <TextH5B>총 개</TextH5B>
          <TextH5B>0원</TextH5B>
        </TotalSumContainer>
        <BorderLine height={1} margin="13px 0 10px 0" />
        <DeliveryInforContainer>
          <TextB2R display="flex">
            13:40 내 주문하면 내일
            <TextH5B padding="0px 4px">새벽 7시 전</TextH5B>도착
          </TextB2R>
        </DeliveryInforContainer>
      </OrderInfoContainer>
      <ButtonContainer onClick={submitHandler}>
        <Button height="100%" width="100%" borderRadius="0">
          확인
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  padding: 0 24px;
  width: 100%;
`;

const MainOption = styled.div`
  width: 100%;
`;
const OptionalOption = styled.div`
  width: 100%;
`;

const OrderInfoContainer = styled.div`
  padding: 0 24px;
  width: 100%;
`;

const SelectedCartItemContainer = styled.div`
  margin-top: 16px;
  width: 100%;
  overflow-y: scroll;
  max-height: 220px;
`;

const TotalSumContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const DeliveryInforContainer = styled.div`
  display: flex;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(CartSheet);
