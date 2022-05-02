import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { bottomSheetButton, FlexCol, FlexRow, FlexBetween, theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { TextB3R, TextH3B, TextH5B, TextH6B } from '@components/Shared/Text';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { Calendar } from '@components/Calendar';
import { SET_ALERT } from '@store/alert';
import { SVGIcon } from '@utils/common';
import { getCustomDate } from '@utils/destination';
import { INIT_USER_DELIVERY_TYPE } from '@store/destination';
import { useMutation, useQueryClient } from 'react-query';
import { editDeliveryDateApi } from '@api/order';
interface IProps {
  title: string;
  disabledDates: string[];
  deliveryAt: string;
  subOrderDelivery?: any[];
  isSheet?: boolean;
  deliveryId: number;
}
/* TODO: 배송일 변경용 캘린더 컴포넌트 따로? */

const CalendarSheet = ({ title, disabledDates, subOrderDelivery = [], isSheet, deliveryAt, deliveryId }: IProps) => {
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState<string>('');

  const queryClient = useQueryClient();

  const { mutate: changeDeliveryDateMutation } = useMutation(
    async () => {
      const { data } = await editDeliveryDateApi({ deliveryId, selectedDeliveryDay });
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getOrderDetail');
      },
    }
  );

  const dispatch = useDispatch();

  const { dates } = getCustomDate(new Date(selectedDeliveryDay));

  const submitHandler = () => {
    dispatch(
      SET_ALERT({
        alertMessage: '배송일 변경은 총 1회 가능해요. 변경하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => {
          dispatch(INIT_BOTTOM_SHEET());
          dispatch(INIT_USER_DELIVERY_TYPE());
          changeDeliveryDateMutation();
        },
      })
    );
  };

  const changeDeliveryDate = (value: string) => {
    setSelectedDeliveryDay(value);
  };

  useEffect(() => {
    setSelectedDeliveryDay(deliveryAt);
  }, []);

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
            <TextH6B>{dates}일 도착</TextH6B>
          </FlexBetween>
        </FlexCol>
      </Wrapper>
      <Calendar
        disabledDates={disabledDates}
        selectedDeliveryDay={selectedDeliveryDay}
        changeDeliveryDate={changeDeliveryDate}
        subOrderDelivery={subOrderDelivery}
        isSheet={isSheet}
      />
      <FlexCol padding="16px 24px">
        <FlexRow>
          <Dot />
          <FlexRow>
            <TextB3R>배송일 변경은 </TextB3R>
            <TextB3R color={theme.brandColor}>총 1회</TextB3R>
            <TextB3R padding="0 0 0 4px">가능합니다.</TextB3R>
          </FlexRow>
        </FlexRow>
        <FlexRow>
          <Dot />
          <TextB3R>품절이나 시즌오프 등의 상품이 포함되어 있는 배송일은 선택할 수 없습니다. </TextB3R>
        </FlexRow>
      </FlexCol>
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

const Dot = styled.div`
  display: flex;
  background-color: ${theme.black};
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin: 0px 8px;
`;

export default React.memo(CalendarSheet);
