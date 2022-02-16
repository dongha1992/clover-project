import React, { useState } from 'react';
import styled from 'styled-components';
import { bottomSheetButton, FlexCol, FlexRow, FlexBetween } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { TextH3B, TextH5B, TextH6B } from '@components/Shared/Text';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { Calendar } from '@components/Calendar';
import { SET_DELIVERY_DATE } from '@store/order';
import { SET_ALERT } from '@store/alert';
import SVGIcon from '@utils/SVGIcon';
interface IProps {
  title: string;
  disabledDates: string[];
  otherDeliveryDate?: string[];
  isSheet?: boolean;
}
/* TODO: 배송일 변경용 캘린더 컴포넌트 따로? */

const CalendarSheet = ({ title, disabledDates, otherDeliveryDate, isSheet }: IProps) => {
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState<string>('');

  const dispatch = useDispatch();

  const submitHandler = () => {
    dispatch(
      SET_ALERT({
        alertMessage: '배송일 변경은 총 1회 가능해요. 변경하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => {
          dispatch(SET_DELIVERY_DATE(selectedDeliveryDay));
          dispatch(INIT_BOTTOM_SHEET());
        },
      })
    );
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="0 0 16px 0" center>
          {title}
        </TextH5B>
        <FlexCol>
          <FlexBetween>
            <FlexRow>
              <TextH3B padding="0 4px 0 0">배송일</TextH3B>
              <SVGIcon name="questionMark" />
            </FlexRow>
            <TextH6B>12일 도착</TextH6B>
          </FlexBetween>
        </FlexCol>
      </Wrapper>
      <Calendar
        disabledDates={disabledDates}
        selectedDeliveryDay={selectedDeliveryDay}
        setSelectedDeliveryDay={setSelectedDeliveryDay}
        otherDeliveryDate={otherDeliveryDate}
        isSheet={isSheet}
      />
      <ButtonContainer onClick={submitHandler}>
        <Button height="100%" width="100%" borderRadius="0">
          변경하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  padding: 24px 24px 8px 24px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(CalendarSheet);
