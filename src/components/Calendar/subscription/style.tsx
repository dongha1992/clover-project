import { theme } from '@styles/theme';
import styled from 'styled-components';

export const SubsCalendarContainer = styled.div`
  background-color: ${theme.greyScale3};
  padding: 16px 24px;

  &.subsCalendar {
    // 캘린더 화살표 <,> + YYYY년 MM월 헤더
    .react-calendar__navigation__label {
      pointer-events: none;
    }
    .react-calendar__tile {
      margin: 0 !important;
      border: 0 !important;
    }
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
          color: #242424;
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
          color: #242424;
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
            color: #fff;
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
      button:disabled {
        abbr {
          color: #c8c8c8;
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
  .menuChange {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    font-style: normal;
    font-weight: 700;
    font-size: 8px;
    line-height: 12px;
    color: #35ad73;
    min-width: 44px;
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
    &.delChange {
      background-image: none;
    }
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
