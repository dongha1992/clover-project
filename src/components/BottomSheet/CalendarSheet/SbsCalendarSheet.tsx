import SbsCalendar from '@components/Calendar/SbsCalendar';
import { RadioButton } from '@components/Shared/Button';
import { TextB2R, TextH5B } from '@components/Shared/Text';
import { SUBSCRIBE_TIME_SELECT } from '@constants/subscription';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import {
  SET_SBS_DELIVERY_EXPECTED_DATE,
  SET_SBS_DELIVERY_TIME,
  SET_SBS_START_DATE,
  SET_PICKUP_DAY,
  subscriptionForm,
} from '@store/subscription';
import { theme } from '@styles/theme';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
interface IProps {
  userSelectPeriod: string; // 유저가 선택한 구독기간(1주,2주,3주,4주,정기구독)
  sbsDates: string[];
}
const SbsCalendarSheet = ({ userSelectPeriod, sbsDates }: IProps) => {
  const dispatch = useDispatch();
  const { sbsDeliveryExpectedDate, sbsStartDate, sbsDeliveryTime, sbsPickupDay } = useSelector(subscriptionForm);
  const [disabledDate, setDisabledDate] = useState<any>([]);
  const [userSelectTime, setUserSelectTime] = useState(sbsDeliveryTime ? sbsDeliveryTime : '점심');
  const [deliveryExpectedDate, setDeliveryExpectedDate] = useState<string[]>(['']);
  const [pickupDay, setPickupDay] = useState<any[]>();
  const [sbsStartDateText, setSbsStartDateText] = useState('');
  const deliveryComplete = ['']; // 배송완료 or 주문취소
  const deliveryHoliday = ['']; // 배송휴무일
  const deliveryChange = ['']; // 배송일변경
  const sumDelivery = ['']; // 배송예정일(합배송 포함)
  const sumDeliveryComplete = ['']; // 배송완료(합배송 포함)

  useEffect(() => {
    let disableDates = [];

    for (let i = 0; i < deliveryHoliday.length; i++) {
      disableDates.push(deliveryHoliday[i]);
    }
    setDisabledDate(disableDates);
  }, []);

  useEffect(() => {
    if (sbsDeliveryExpectedDate) {
      setDeliveryExpectedDate(sbsDeliveryExpectedDate);
    }
  }, []);

  useEffect(() => {
    // store에 구독요일이 있으면 구독요일 useState에 저장
    if (sbsPickupDay) setPickupDay(sbsPickupDay);
  }, []);

  useEffect(() => {
    setSbsStartDateText(
      `${dayjs(deliveryExpectedDate[0]).format('M')}월 ${dayjs(deliveryExpectedDate[0]).format('DD')}일 (${dayjs(
        deliveryExpectedDate[0]
      ).format('dd')}) / ${pickupDay?.join('·')} / ${userSelectTime}`
    );
  }, [deliveryExpectedDate, pickupDay, userSelectTime]);

  const changeRadioHanler = (type: string) => {
    setUserSelectTime(type);
  };

  const subscribeClickHandler = () => {
    dispatch(
      SET_SBS_START_DATE({
        sbsStartDate: `${sbsStartDateText}`,
      })
    );
    dispatch(SET_PICKUP_DAY({ sbsPickupDay: pickupDay }));
    dispatch(SET_SBS_DELIVERY_EXPECTED_DATE({ sbsDeliveryExpectedDate: deliveryExpectedDate }));
    dispatch(SET_SBS_DELIVERY_TIME({ sbsDeliveryTime: userSelectTime }));
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <TitleBox>
        <TextH5B padding="24px 0 16px 0">구독 시작/배송일</TextH5B>
        <TextB2R padding="0 0 16px 0">시작일을 선택하면 배송 플랜이 자동으로 설정됩니다.</TextB2R>
      </TitleBox>
      <SbsCalendar
        disabledDate={disabledDate}
        deliveryComplete={deliveryComplete}
        deliveryExpectedDate={deliveryExpectedDate}
        setDeliveryExpectedDate={setDeliveryExpectedDate}
        deliveryHoliday={deliveryHoliday}
        deliveryChange={deliveryChange}
        sumDelivery={sumDelivery}
        sumDeliveryComplete={sumDeliveryComplete}
        sbsDates={sbsDates}
        setPickupDay={setPickupDay}
      />
      <RadioWrapper>
        {SUBSCRIBE_TIME_SELECT.map((item) => {
          // let isSelected;
          let isSelected = userSelectTime === item.type;

          return (
            <RadioLi key={item.id}>
              <RadioButton isSelected={isSelected} onChange={() => changeRadioHanler(item.type)} />
              <TextB2R className="textBox">
                <span className="fBold">{item.type}</span> {item.text}
              </TextB2R>
            </RadioLi>
          );
        })}
      </RadioWrapper>
      <BottomButton onClick={subscribeClickHandler} disabled={pickupDay ? false : sbsStartDate ? false : true}>
        <TextH5B>
          {pickupDay
            ? `${sbsStartDateText} 구독하기`
            : sbsStartDate
            ? `${sbsStartDate} 구독하기`
            : '구독 시작/배송일을 설정해주세요'}
        </TextH5B>
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
const RadioWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;
const RadioLi = styled.li`
  display: flex;
  flex: 1 1 40%;
  align-items: center;
  padding-bottom: 16px;
  &:last-of-type {
    padding-bottom: 0;
  }
  .textBox {
    line-height: 1;
    margin-top: 2px;
    span.fBold {
      font-weight: bold;
      margin-left: 8px;
    }
  }
`;
const BottomButton = styled.button`
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: ${theme.black};
  color: #fff;
  &:disabled {
    background-color: ${theme.greyScale6};
    color: ${theme.greyScale25};
  }
`;
export default React.memo(SbsCalendarSheet);
