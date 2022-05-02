import { onError } from '@api/Api';
import { theme } from '@styles/theme';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import 'dayjs/locale/ko';
import { SET_SUBS_DELIVERY_EXPECTED_DATE, SET_SUBS_ORDER_MENUS, subscriptionForm } from '@store/subscription';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
dayjs.locale('ko');
interface IProps {
  disabledDate?: string[];
  deliveryComplete?: string[];
  deliveryExpectedDate?: string[];
  setDeliveryExpectedDate?: (value: string[]) => void;
  deliveryHoliday?: string[];
  deliveryChange?: string[];
  sumDelivery?: string[];
  sumDeliveryComplete?: string[];
  subsDates: string[];
  setPickupDay?: (value: any[]) => void;
  setSelectDate?: Dispatch<SetStateAction<Date | undefined>>;
  calendarType?: string;
}

const SubsCalendar = ({
  disabledDate = [], // 구독캘린더 inactive 날짜리스트
  deliveryComplete = [], // 배송완료 or 주문취소
  deliveryExpectedDate = [], // 배송예정일
  setDeliveryExpectedDate, // 배송예정일 setState
  deliveryHoliday = [], // 배송휴무일
  deliveryChange = [], // 배송일변경
  sumDelivery = [], // 배송예정일(합배송 포함)
  sumDeliveryComplete = [], // 배송완료(합배송 포함)
  subsDates, // 초기 구독캘린더 active 날짜리스트
  setPickupDay, // 구독 플랜 단계에서 픽업 날짜
  setSelectDate, // 선택한 날짜
  calendarType, // 캘린더 타입
}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { subsDeliveryExpectedDate } = useSelector(subscriptionForm);

  const today = dayjs().format('YYYY-MM-DD');
  const [value, setValue] = useState<Date>();
  const [maxDate, setMaxDate] = useState(new Date(subsDates[subsDates.length - 1]));

  useEffect(() => {
    if (subsDeliveryExpectedDate.length !== 0) {
      setValue(new Date(subsDeliveryExpectedDate[0]));
      setMaxDate(new Date(subsDeliveryExpectedDate[subsDeliveryExpectedDate.length - 1]));
    }
  }, [subsDeliveryExpectedDate]);

  useEffect(() => {
    // 배송일 변경시 변경할려는 날짜에 합배송이 있을경우
    if (sumDelivery.find((x) => x === subsDates[0])) {
    }
  }, []);

  // const [sumDeliveryChange, setSumDeliveryChange] = useState(false);
  // useEffect(() => {
  //   // 배송일 변경
  //   // 배송예정일(합배송 포함)일때
  //   if (sumDelivery.find((x) => x === dayjs(value).format('YYYY-MM-DD'))) {
  //     setSumDeliveryChange(true);
  //   }
  // }, []);

  const titleContent = useCallback(
    ({ date, view }: { date: any; view: any }) => {
      let element = [];
      if (calendarType === 'deliveryChange' && deliveryExpectedDate[0] === dayjs(date).format('YYYY-MM-DD')) {
        // 배송일변경 시 변경전 날짜
        element.push(<div className="deliveryChangeBeforeDate" key={`00-${dayjs(date).format('YYYY-MM-DD')}`}></div>);
      }
      if (deliveryExpectedDate.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        element.push(<div className="deliveryExpectedDate" key={`01-${dayjs(date).format('YYYY-MM-DD')}`}></div>);
      }
      if (today === dayjs(date).format('YYYY-MM-DD')) {
        // 오늘
        element.push(
          <div className="today" key={`02-${dayjs(date).format('YYYY-MM-DD')}`}>
            오늘
          </div>
        );
      }
      if (deliveryHoliday.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송 휴무일
        element.push(
          <div className="deliveryHoliday" key={`03-${dayjs(date).format('YYYY-MM-DD')}`}>
            배송휴무일
          </div>
        );
      }
      if (deliveryComplete.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송완료 or 주문취소
        element.push(<div className="deliveryComplete" key={`04-${dayjs(date).format('YYYY-MM-DD')}`}></div>);
      }
      if (deliveryChange.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송일변경
        element.push(
          <div className="deliveryChange" key={`05-${dayjs(date).format('YYYY-MM-DD')}`}>
            <span>배송일변경</span>
          </div>
        );
      }
      if (sumDelivery.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송예정일(합배송 포함)
        console.log('sumDelivery', sumDelivery);

        element.push(
          <div className="sumDelivery" key={`06-${dayjs(date).format('YYYY-MM-DD')}`}>
            <span></span>
          </div>
        );
      }
      if (sumDeliveryComplete.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송완료(합배송 포함)
        element.push(
          <div className="sumDeliveryComplete" key={`07-${dayjs(date).format('YYYY-MM-DD')}`}>
            <span></span>
          </div>
        );
      }

      return <>{element}</>;
    },
    [deliveryExpectedDate]
  );

  const tileDisabled = ({ date, view }: { date: any; view: any }) => {
    if (!subsDates.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      return true;
    }
    if (date.getDay() === 0) {
      // 일요일 비활성화
      return true;
    } else if (disabledDate.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      // 비활성 날짜
      return true;
    } else {
      return false;
    }
  };

  const { mutate: mutateSelectDate } = useMutation(
    async (id: string) => {
      const { data } = await axios.get(`http://localhost:9009/api/subsList/${id}`);

      return data.data;
    },
    {
      onSuccess: async (data) => {
        let dates: string[] = [];
        let pickupDayObj = new Set();

        await data.deliveryDates.map((item: any) => {
          dates.push(item.deliveryDate);
          pickupDayObj.add(dayjs(item.deliveryDate).format('dd'));
        });

        setDeliveryExpectedDate && setDeliveryExpectedDate(dates);
        setMaxDate(new Date(dates[dates.length - 1]));

        // 픽업 요일
        setPickupDay && setPickupDay(Array.from(pickupDayObj));
        dispatch(SET_SUBS_ORDER_MENUS(data));
      },
      onSettled: () => {},
      onError: () => {
        console.log('error');
      },
    }
  );

  const onChange = (value: Date, event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);
    // TODO(young) : 구독 리스트 정보 받는 api
    if (router.pathname === '/subscription/set-info') {
      mutateSelectDate(dayjs(value).format('YYYY-MM-DD'));
    }
    if (setSelectDate) {
      setSelectDate(value);
    }
  };

  return (
    <CalendarBox className="subsCalendar">
      <Calendar
        calendarType={'Hebrew'}
        prev2Label={null}
        next2Label={null}
        minDate={new Date(subsDates[0])}
        maxDate={maxDate}
        onChange={onChange}
        value={value}
        // showNeighboringMonth={false}
        formatDay={(locale, date) => dayjs(date).format('D')}
        tileContent={titleContent}
        tileDisabled={tileDisabled}
      />
    </CalendarBox>
  );
};
const CalendarBox = styled.div`
  background-color: ${theme.greyScale3};
  padding: 16px 24px;

  &.subsCalendar {
    // 캘린더 화살표 <,> + YYYY년 MM월 헤더
    .react-calendar__navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      > button {
        background-color: #f8f8f8;
      }

      // YYYY년 MM월
      .react-calendar__navigation__label {
        display: flex;
        flex-grow: 0 !important;
        align-items: center;
        padding: 0;
        height: 24px;
        span {
          font-family: 'Noto Sans KR', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
        }
      }

      // < left 버튼
      .react-calendar__navigation__prev-button {
        background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 3L6 9L12 15' stroke='%23242424' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
        &:disabled {
          background-image: url("data:image/svg+xml,%3Csvg width='19' height='18' viewBox='0 0 19 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.4951 3L6.49512 9L12.4951 15' stroke='%23C8C8C8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
        }
      }

      // > right 버튼
      .react-calendar__navigation__next-button {
        background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 15L12 9L6 3' stroke='%23242424' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
        &:disabled {
          background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 15L12 9L6 3' stroke='%23C8C8C8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }
      }
      .react-calendar__navigation__prev-button,
      .react-calendar__navigation__next-button {
        width: 18px;
        height: 18px;
        padding: 0;
        color: transparent;
      }
    }

    // 캘린더 요일
    .react-calendar__month-view__weekdays {
      justify-content: space-around;
      height: 44px;
      margin-bottom: 4px;
      > div {
        flex: 1 !important;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        abbr {
          font-family: 'Noto Sans KR', sans-serif;
          color: #9c9c9c;
          font-style: normal;
          font-weight: 700;
          font-size: 14px;
          line-height: 22px;
          text-decoration: none;
        }
      }
    }

    // 캘린더 날짜
    .react-calendar__month-view__days {
      > button {
        cursor: pointer;
        position: relative;
        padding: 0;
        height: 48px;
        display: flex;
        justify-content: center;
        background-color: #f8f8f8;
        overflow: visible;
        &:nth-of-type(6n) {
        }
        &:last-of-type {
          margin-bottom: 0;
        }
        abbr {
          display: flex;
          align-items: center;
          height: 32px;
          font-family: 'Noto Sans KR', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 14px;
          z-index: 1;
        }

        // 날짜 선택 된 상태
        &.react-calendar__tile--active {
          position: relative;
          color: #fff;

          &::after {
            content: '';
            position: absolute;
            width: 32px;
            height: 32px;
            background-color: #35ad73;
            border-radius: 50%;
          }
          abbr {
            z-index: 1;
          }
          .deliveryExpectedDate,
          .deliveryComplete,
          .today,
          .deliveryHoliday,
          .deliveryChange,
          .sumDeliveryComplete {
            display: none;
          }
        }
      }
    }
    //
  }

  // 구독 라벨
  .deliveryExpectedDate {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='15.5' stroke='%2335AD73' stroke-dasharray='2 2'/%3E%3C/svg%3E%0A");
  }
  .deliveryChangeBeforeDate {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #daece3;
  }
  .deliveryComplete {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='15.5' stroke='%23C8C8C8' stroke-dasharray='2 2'/%3E%3C/svg%3E ");
  }
  .today {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    font-style: normal;
    font-weight: 700;
    font-size: 8px;
    line-height: 12px;
    color: #9c9c9c;
  }
  .deliveryHoliday {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    font-style: normal;
    font-weight: 700;
    font-size: 8px;
    line-height: 12px;
    color: #9c9c9c;
    min-width: 44px;
  }
  .deliveryChange {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='15.5' stroke='%2335AD73' stroke-dasharray='2 2'/%3E%3C/svg%3E%0A");
    span {
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      font-style: normal;
      font-weight: 700;
      font-size: 8px;
      line-height: 12px;
      color: #35ad73;
      min-width: 44px;
    }
  }
  .sumDelivery {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='15.5' stroke='%2335AD73' stroke-dasharray='2 2'/%3E%3C/svg%3E%0A");
    span {
      width: 6px;
      height: 6px;
      background-color: #35ad73;
      border-radius: 50%;
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .sumDeliveryComplete {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='15.5' stroke='%23C8C8C8' stroke-dasharray='2 2'/%3E%3C/svg%3E ");
    span {
      width: 6px;
      height: 6px;
      background-color: #c8c8c8;
      border-radius: 50%;
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;
export default SubsCalendar;
