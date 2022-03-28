import { theme } from '@styles/theme';
import dayjs from 'dayjs';
import { useState } from 'react';
import Calendar from 'react-calendar';
import styled from 'styled-components';

const SbsCalendar = () => {
  const [value, onChange] = useState(new Date());
  const today = dayjs().format('YYYY-MM-DD');
  const complete = ['2022-03-26'];
  const deliveryExpectedDate = ['2022-03-25'];
  const deliveryHoliday = ['2022-03-27'];
  const deliveryChange = ['2022-03-28'];
  const sumDelivery = ['2022-03-29'];
  const sumDeliveryComplete = ['2022-03-30'];

  const titleContent = ({ date, view }: { date: any; view: any }) => {
    let element = [];

    if (deliveryExpectedDate.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      element.push(<div className="dot" key={0}></div>);
    } else if (today === dayjs(date).format('YYYY-MM-DD')) {
      element.push(
        <div className="today" key={0}>
          오늘
        </div>
      );
    } else if (deliveryHoliday.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      element.push(
        <div className="deliveryHoliday" key={0}>
          배송휴무일
        </div>
      );
    } else if (complete.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      element.push(<div className="complete" key={0}></div>);
    } else if (deliveryChange.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      element.push(
        <div className="deliveryChange" key={0}>
          <span>배송휴무일</span>
        </div>
      );
    } else if (sumDelivery.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      element.push(
        <div className="sumDelivery" key={0}>
          <span></span>
        </div>
      );
    } else if (sumDeliveryComplete.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      element.push(
        <div className="sumDeliveryComplete" key={0}>
          <span></span>
        </div>
      );
    }
    return <>{element}</>;
  };

  return (
    <CalendarBox className="sbsCalendar">
      <Calendar
        prev2Label={null}
        next2Label={null}
        minDate={new Date()}
        onChange={onChange}
        value={value}
        showNeighboringMonth={false}
        formatDay={(locale, date) => dayjs(date).format('D')}
        tileContent={titleContent}
      />
    </CalendarBox>
  );
};
const CalendarBox = styled.div`
  background-color: ${theme.greyScale3};
  padding: 16px 24px;

  &.sbsCalendar {
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
        background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 3L6 9L12 15' stroke='%23242424' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' /%3E%3C/svg%3E");
        &:disabled {
          background-image: url("data:image/svg+xml, %3Csvg width='19' height='18' viewBox='0 0 19 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.7656 3L6.76563 9L12.7656 15' stroke='%23C8C8C8' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' /%3E%3C/svg%3E");
        }
      }

      // > right 버튼
      .react-calendar__navigation__next-button {
        background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 15L12 9L6 3' stroke='%23242424' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' /%3E%3C/svg%3E");
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
          .dot,
          .complete,
          .today,
          .deliveryHoliday,
          .deliveryChange,
          .sumDelivery,
          .sumDeliveryComplete {
            display: none;
          }
        }
      }
    }
    //
  }

  // 구독 라벨
  .dot {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='15.5' stroke='%2335AD73' stroke-dasharray='2 2'/%3E%3C/svg%3E%0A");
  }
  .complete {
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
export default SbsCalendar;
