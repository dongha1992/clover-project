import React, { useState } from 'react';
import { OrderFilter } from '@components/Filter/components';
import { TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { ORDER_DATE_RADIO_CHECKBOX } from '@constants/filter';
import { theme, bottomSheetButton } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { useDispatch } from 'react-redux';
import { SET_ORDER_LIST_FILTER } from '@store/common';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';

interface IProps {
  handler: React.Dispatch<React.SetStateAction<string>>;
}

const OrderDateFilter = ({ handler }: IProps) => {
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>('90');
  const dispatch = useDispatch();

  const radioButtonHandler = (value: string) => {
    setSelectedRadioValue(value);
  };

  const changeWithInDays = () => {
    handler(selectedRadioValue);
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        정렬
      </TextH5B>
      <Wrapper>
        <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
          정렬
        </TextH5B>
        <OrderFilter
          data={ORDER_DATE_RADIO_CHECKBOX}
          changeHandler={radioButtonHandler}
          selectedRadioValue={selectedRadioValue}
        />
      </Wrapper>
      <ButtonContainer>
        <Button height="100%" width="100%" borderRadius="0" onClick={changeWithInDays}>
          적용하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 32px;
`;
const Wrapper = styled.div`
  padding-left: 24px;
`;
const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(OrderDateFilter);
