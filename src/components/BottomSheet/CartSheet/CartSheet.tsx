import React, { useState } from 'react';
import styled, { css } from 'styled-components';
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
import { useInterval } from '@hooks/useInterval';

/* TODO: 필수옵션, 선택옵션 api 형에 따라 구조 바꿔야 함. 현재는 목데이터 기준으로 설계함 
        https://www.figma.com/file/JoJXAkWwkDIiQutsxL170J/FC_App2.0_UI?node-id=6128%3A177385
*/

const ROLLING_DATA = [
  {
    type: '새벽배송',
    description: '17시까지 주문 시 다음날 새벽 7시 전 도착',
  },
  {
    type: '택배배송',
    description: '17시까지 주문 시 당일 발송',
  },
  {
    type: '스팟점심',
    description: '9시30분까지 주문 시 12시 전 도착',
  },
  {
    type: '스팟저녁',
    description: '11시까지 주문 시 17시 전 도착',
  },
];

const CartSheet = () => {
  const [currentRollingIndex, setCurrentRollingIndex] = useState(0);
  const [selectedMenus, setSelectedMenus] = useState<any>([]);

  const { showToast } = useToast();

  const dispatch = useDispatch();
  const { cartSheetObj } = useSelector(cartForm);

  const selectMenuHandler = (menu: any) => {
    setSelectedMenus([...selectedMenus, menu]);
  };

  const getCalculateTotalPrice = () => {
    return selectedMenus.reduce((acc: number, cur: any) => {
      return acc + cur.price;
    }, 0);
  };

  const removeCartItemHandler = (id: number): void => {
    const newSelectedMenus = selectedMenus.filter(
      (item: any) => item.id !== id
    );
    setSelectedMenus(newSelectedMenus);
  };

  const submitHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
    dispatch(SET_CART_LISTS(selectedMenus));
    setTimeout(() => {
      showToast({ message: '장바구니에 담겼습니다.' });
    }, 500);
  };

  const test = () => {
    const rollingDataLen = ROLLING_DATA.length;
    if (currentRollingIndex >= rollingDataLen - 1) {
      setCurrentRollingIndex(0);
    } else {
      setCurrentRollingIndex((prev) => prev + 1);
    }
  };

  useInterval(test, 3000);
  /* TODO: cartSheetObj 가끔 못 찾음 원인 파악 */

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
              <CartSheetItem
                menu={menu}
                key={index}
                padding="16px"
                removeCartItemHandler={removeCartItemHandler}
              />
            ))}
          </SelectedCartItemContainer>
        ) : null}
      </Wrapper>
      <OrderInfoContainer>
        <TotalSumContainer>
          <TextH5B>총 {selectedMenus.length}개</TextH5B>
          <TextH5B>{getCalculateTotalPrice()}원</TextH5B>
        </TotalSumContainer>
        <BorderLine height={1} margin="13px 0 10px 0" />
        <DeliveryInforContainer>
          <RollingWrapper>
            <RollingBox>
              {ROLLING_DATA.map((item, index) => {
                const isTarget = currentRollingIndex === index;
                const previousIndex =
                  currentRollingIndex - 1 >= 0
                    ? currentRollingIndex - 1
                    : ROLLING_DATA.length - 1;
                const isRolled = previousIndex === index;

                return (
                  <TextWrapper
                    key={index}
                    isTarget={isTarget}
                    isRolled={isRolled}
                  >
                    <TextH5B padding="0 4px 0 0">{item.type}</TextH5B>
                    <TextB2R>{item.description}</TextB2R>
                  </TextWrapper>
                );
              })}
            </RollingBox>
          </RollingWrapper>
        </DeliveryInforContainer>
      </OrderInfoContainer>
      <ButtonContainer onClick={submitHandler}>
        <Button height="100%" width="100%" borderRadius="0">
          장바구니에 담기
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
  margin-bottom: 16px;
  width: 100%;
  margin-bottom: 16px;
`;

const SelectedCartItemContainer = styled.div`
  margin-top: 16px;
  width: 100%;
  overflow-y: scroll;
  max-height: 220px;
`;

const RollingWrapper = styled.div`
  height: 25px;
  width: 100%;
`;

const RollingBox = styled.ul`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const TextWrapper = styled.li<{ isTarget?: boolean; isRolled?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  transition: 0.5s;
  transition: top 0.75s;
  top: 100%;
  z-index: 1;
  background-color: #ffffff;

  ${({ isTarget, isRolled }) => {
    if (isTarget) {
      return css`
        top: 0;
        z-index: 100;
      `;
    } else if (isRolled) {
      return css`
        top: -100%;
        z-index: 10;
      `;
    }
  }}
`;

const TotalSumContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const DeliveryInforContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(CartSheet);
