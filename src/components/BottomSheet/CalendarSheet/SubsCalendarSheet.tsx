import { getSubscriptionApi } from '@api/menu';
import SubsCalendar from '@components/Calendar/SubsCalendar';
import { RadioButton } from '@components/Shared/Button';
import { TextB2R, TextH5B } from '@components/Shared/Text';
import { SUBSCRIBE_TIME_SELECT } from '@constants/subscription';
import { ISubsActiveDate } from '@model/index';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import {
  SET_SUBS_DELIVERY_EXPECTED_DATE,
  SET_SUBS_START_DATE,
  subscriptionForm,
  SUBS_INIT,
  SET_SUBS_INFO_STATE,
} from '@store/subscription';
import { theme } from '@styles/theme';
import { getFormatDate } from '@utils/common';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
interface IProps {
  userSelectPeriod: string; // 유저가 선택한 구독기간(1주,2주,3주,4주,정기구독)
}
const SubsCalendarSheet = ({ userSelectPeriod }: IProps) => {
  const dispatch = useDispatch();
  const { subsDeliveryExpectedDate, subsStartDate, subsInfo } = useSelector(subscriptionForm);
  const [disabledDate, setDisabledDate] = useState<any>([]);
  const [userSelectTime, setUserSelectTime] = useState(subsInfo?.deliveryTime ? subsInfo.deliveryTime : '점심');
  const [deliveryExpectedDate, setDeliveryExpectedDate] = useState<{ deliveryDate: string }[]>([{ deliveryDate: '' }]);
  const [pickupDay, setPickupDay] = useState<any[]>();
  const [subsStartDateText, setSubsStartDateText] = useState('');
  const deliveryHoliday = ['']; // 배송휴무일

  const { data: subsActiveDates, isLoading } = useQuery(
    'subsActiveDates',
    async () => {
      const params = {
        id: 824,
        destinationId: 2,
        subscriptionPeriod: userSelectPeriod,
      };
      const { data } = await getSubscriptionApi(params);
      return data.data.menuTables as ISubsActiveDate[];
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  useEffect(() => {
    let disableDates = [];
    for (let i = 0; i < deliveryHoliday.length; i++) {
      disableDates.push(deliveryHoliday[i]);
    }
    setDisabledDate(disableDates);
  }, []);

  useEffect(() => {
    // [구독 전 캘린더] 이미 날짜를 선택했으면 이전에 선택한 날짜를 배송예정일(deliveryExpectedDate)에 넣는다.
    // 배송예정일(deliveryExpectedDate)은 SubsCalendar에서 날짜를 선택할때 담긴다.
    if (subsDeliveryExpectedDate) {
      setDeliveryExpectedDate(subsDeliveryExpectedDate);
    }
  }, []);

  useEffect(() => {
    // store에 구독요일이 있으면 구독요일 useState에 저장
    if (subsInfo?.pickup) setPickupDay(subsInfo.pickup);
  }, []);

  useEffect(() => {
    if (deliveryExpectedDate && pickupDay && userSelectTime) {
      setSubsStartDateText(
        `${getFormatDate(deliveryExpectedDate[0]?.deliveryDate)} / ${pickupDay?.join('·')} / ${userSelectTime}`
      );
    }
  }, [deliveryExpectedDate, pickupDay, userSelectTime]);

  const changeRadioHanler = (type: string) => {
    setUserSelectTime(type);
  };

  const subscribeClickHandler = () => {
    dispatch(
      SET_SUBS_START_DATE({
        subsStartDate: `${subsStartDateText}`,
      })
    );
    dispatch(
      SET_SUBS_INFO_STATE({
        startDate: `${dayjs(deliveryExpectedDate[0]?.deliveryDate).format('M')}월 ${dayjs(
          deliveryExpectedDate[0]?.deliveryDate
        ).format('DD')}일 (${dayjs(deliveryExpectedDate[0]?.deliveryDate).format('dd')})`,
        deliveryDay: pickupDay,
        deliveryTime: userSelectTime,
      })
    );

    dispatch(SET_SUBS_DELIVERY_EXPECTED_DATE({ subsDeliveryExpectedDate: deliveryExpectedDate }));
    dispatch(INIT_BOTTOM_SHEET());
  };

  if (isLoading) return <div>...로딩중</div>;

  return (
    <Container>
      <TitleBox>
        <TextH5B padding="24px 0 16px 0">구독 시작/배송일</TextH5B>
        <TextB2R padding="0 0 16px 0">시작일을 선택하면 배송 플랜이 자동으로 설정됩니다.</TextB2R>
      </TitleBox>
      <SubsCalendar
        subsActiveDates={subsActiveDates!}
        disabledDate={disabledDate}
        deliveryExpectedDate={deliveryExpectedDate}
        setDeliveryExpectedDate={setDeliveryExpectedDate}
        deliveryHoliday={deliveryHoliday}
        setPickupDay={setPickupDay}
        subsPeriod={userSelectPeriod}
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
      <BottomButton onClick={subscribeClickHandler} disabled={pickupDay ? false : subsStartDate ? false : true}>
        <TextH5B>
          {pickupDay
            ? `${subsStartDateText} 구독하기`
            : subsStartDate
            ? `${subsStartDate} 구독하기`
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
export default React.memo(SubsCalendarSheet);
