import { TextH5B } from '@components/Shared/Text';
import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { orderForm, SET_ORDER_TYPE } from '@store/order';
import { useDispatch, useSelector } from 'react-redux';
import { Button, RadioButton } from '@components/Shared/Button';
import { initBottomSheet } from '@store/bottomSheet';
import { bottomSheetButton } from '@styles/theme';

const list = [
  { id: 1, value: '스팟점심' },
  { id: 2, value: '스팟저녁' },
  { id: 3, value: '새벽배송' },
  { id: 4, value: '택배배송' },
];

const OrderSheet: React.FC = () => {
  const dispatch = useDispatch();
  const { orderType } = useSelector(orderForm);
  const router = useRouter();
  const [isSelected, setIsSelected] = useState<string>(orderType);

  const oderTypeChange = () => {
    dispatch(SET_ORDER_TYPE({ orderType: isSelected }));
    dispatch(initBottomSheet());
  };
  return (
    <Container>
      <Title>
        <TextH5B>배송방법</TextH5B>
      </Title>
      {list.map((item) => (
        <Item key={item.id}>
          <RadioButton
            onChange={() => {
              setIsSelected(item.value);
            }}
            isSelected={isSelected === item.value}
          />
          <TextH5B className="orderType">{item.value}</TextH5B>
        </Item>
      ))}
      <ButtonContainer onClick={oderTypeChange}>
        <Button height="100%" width="100%" borderRadius="0">
          변경하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 24px;
`;
const Title = styled.h2`
  display: flex;
  justify-content: center;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  &:last-of-type {
    margin-bottom: 0;
  }
  .orderType {
    margin-left: 9px;
  }
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default OrderSheet;
