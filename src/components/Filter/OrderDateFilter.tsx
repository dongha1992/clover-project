import React, { useState } from 'react';
import { OrderFilter } from '@components/Filter/components';
import { TextB3R, TextH5B } from '@components/Shared/Text';
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
        조회 기간
      </TextH5B>
      <Wrapper>
        <OrderFilter
          data={ORDER_DATE_RADIO_CHECKBOX}
          changeHandler={radioButtonHandler}
          selectedRadioValue={selectedRadioValue}
        />
        <TextB3R padding="12px 0 0 0">
          최근 1년 이내 구독 내역만 조회 가능해요. (이전 구독 내역은 고객센터로 문의해 주세요.)
        </TextB3R>
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
`;
const Wrapper = styled.div`
  padding: 24px;
`;
const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(OrderDateFilter);
