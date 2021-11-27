import React, { useState } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB2R } from '@components/Text';
import { Select, Option } from '@components/Dropdown';
import { theme } from '@styles/theme';
import BorderLine from '@components/BorderLine';
import { useSelector, useDispatch } from 'react-redux';
import { cartForm, SET_TEMP_SELECTED_MENUS } from '@store/cart';
import CartModalItem from './CartModalItem';

function CartModalGroup() {
  const [selectedMenus, setSelectedMenus] = useState<any>([]);

  const dispatch = useDispatch();
  const { cartModalObj } = useSelector(cartForm);

  const selectMenuHandler = (menu: any) => {
    setSelectedMenus([...selectedMenus, menu]);
    dispatch(SET_TEMP_SELECTED_MENUS(menu));
  };

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
            {cartModalObj?.main.map((option: any, index: number) => (
              <Option
                key={index}
                option={option}
                selectMenuHandler={selectMenuHandler}
              />
            ))}
          </Select>
        </MainOption>
        <OptionalOption>
          {cartModalObj?.secondary.length > 0 ? (
            <>
              <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
                선택옵션
              </TextH5B>
              <Select placeholder="선택옵션" type={'optional'}>
                {cartModalObj?.secondary.map((option: any, index: number) => (
                  <Option
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
              <CartModalItem menu={menu} key={index} />
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
    </Container>
  );
}

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

export default React.memo(CartModalGroup);