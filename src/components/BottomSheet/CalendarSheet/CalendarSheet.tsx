import React, { useState } from 'react';
import styled from 'styled-components';
import { bottomSheetButton } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { TextH5B } from '@components/Shared/Text';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { Calendar } from '@components/Calendar';
import { SET_DELIVERY_DATE } from '@store/order';
import { IDateObj } from '@components/Calendar/Calendar';

interface IProps {
  title: string;
  disabledDates: string[];
}
/* TODO: 배송일 변경용 캘린더 컴포넌트 따로? */

const CalendarSheet = ({ title, disabledDates }: IProps) => {
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState<string>('');

  const dispatch = useDispatch();

  const submitHandler = () => {
    dispatch(SET_DELIVERY_DATE(selectedDeliveryDay));
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="0 0 16px 0" center>
          {title}
        </TextH5B>
        <Calendar
          disabledDates={disabledDates}
          selectedDeliveryDay={selectedDeliveryDay}
          setSelectedDeliveryDay={setSelectedDeliveryDay}
        />
      </Wrapper>
      <ButtonContainer onClick={() => submitHandler()}>
        <Button height="100%" width="100%" borderRadius="0">
          변경하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  padding: 24px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(CalendarSheet);
