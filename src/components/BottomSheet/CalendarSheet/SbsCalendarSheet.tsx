import SbsCalendar from '@components/Calendar/SbsCalendar';
import { TextB2R, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
interface IProps {
  userSelectPeriod: string; // 유저가 선택한 구독기간(1주,2주,3주,4주,정기구독)
  sbsDates: string[];
}
const SbsCalendarSheet = ({ userSelectPeriod, sbsDates }: IProps) => {
  const [disabledDate, setDisabledDate] = useState<any>([]);
  console.log(disabledDate);

  const calendarActivePeriod = [
    dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dayjs().add(30, 'day').format('YYYY-MM-DD'),
  ];
  const deliveryComplete = ['2022-04-12']; // 배송완료 or 주문취소
  const deliveryExpectedDate = ['2022-04-25']; // 배송예정일
  // const [deliveryExpectedDate] = useState(sbsDates);
  const deliveryHoliday = ['2022-04-13']; // 배송휴무일
  const deliveryChange = ['2022-04-14']; // 배송일변경
  const sumDelivery = ['2022-04-29']; // 배송예정일(합배송 포함)
  const sumDeliveryComplete = ['2022-04-15']; // 배송완료(합배송 포함)

  useEffect(() => {
    let disableDates = [];
    // for (let i = 14; i < 31; i++) {
    //   disableDates.push(dayjs().add(i, 'day').format('YYYY-MM-DD'));
    // }
    for (let i = 0; i < deliveryHoliday.length; i++) {
      disableDates.push(deliveryHoliday[i]);
    }
    // setDisabledDate(disableDates);
  }, []);

  return (
    <Container>
      <TitleBox>
        <TextH5B padding="24px 0 16px 0">구독 시작/배송일</TextH5B>
        <TextB2R padding="0 0 16px 0">시작일을 선택하면 배송 플랜이 자동으로 설정됩니다.</TextB2R>
      </TitleBox>
      <SbsCalendar
        calendarActivePeriod={calendarActivePeriod}
        disabledDate={disabledDate}
        deliveryComplete={deliveryComplete}
        deliveryExpectedDate={deliveryExpectedDate}
        deliveryHoliday={deliveryHoliday}
        deliveryChange={deliveryChange}
        sumDelivery={sumDelivery}
        sumDeliveryComplete={sumDeliveryComplete}
      />
      <BottomButton>
        <TextH5B>구독 시작/배송일을 설정해주세요</TextH5B>
      </BottomButton>
    </Container>
  );
};
const Container = styled.div``;
const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const BottomButton = styled.button`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: ${theme.greyScale6};
  color: ${theme.greyScale25};
`;
export default React.memo(SbsCalendarSheet);
