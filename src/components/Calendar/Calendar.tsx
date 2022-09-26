import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Days from './Days';
import { theme, FlexCol, FlexRow } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { getCustomDate } from '@utils/destination';
import { Obj, ILunchOrDinner } from '@model/index';
import { useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';
import { pipe, filter, map, toArray } from '@fxts/core';
import { getFormatTime } from '@utils/destination/getFormatTime';
import { IGetOrderListResponse, ISubOrderDelivery } from '@model/index';
import { ItemInfo } from '@components/Pages/Mypage/OrderDelivery';

let WEEKS: Obj = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

const ONE_WEEK = 7;
const TWO_WEEKS = 14;
const ACTIVE_DAY_OF_WEEK = 2;
export const LIMIT_DAYS = 6;

export interface IDateObj {
  years: number;
  month: number;
  date: number;
  day: number;
  value: string;
  dayKor: string;
}

interface ICalendar {
  disabledDates: string[];
  subOrderDelivery?: ISubOrderDelivery[];
  selectedDeliveryDay: string;
  changeDeliveryDate: ({ value, isChanged }: { value: string; isChanged: boolean }) => void;
  goToSubDeliverySheet?: (id: number) => void;
  lunchOrDinner?: ILunchOrDinner[];
  isSheet?: boolean;
  isSpotAvailable?: boolean;
  pickupType?: string;
}

const Calendar = ({
  disabledDates = [],
  subOrderDelivery,
  selectedDeliveryDay,
  changeDeliveryDate,
  isSheet,
  goToSubDeliverySheet,
  lunchOrDinner,
  isSpotAvailable,
  pickupType,
}: ICalendar) => {
  const { userDeliveryType } = useSelector(destinationForm);

  const [dateList, setDateList] = useState<IDateObj[]>([]);
  const [isShowMoreWeek, setIsShowMoreWeek] = useState<boolean>(false);
  const [customDisabledDate, setCustomDisabledDate] = useState<string[]>([]);
  const [subOrderDeliveryInActiveDates, setSubDeliveryInActiveDates] = useState<ISubOrderDelivery[]>([]);

  const selectedDay =
    sessionStorage.getItem('selectedDay') !== 'undefined' ? sessionStorage.getItem('selectedDay') : null;

  const isLocker = pickupType === 'GS_LOCKER' || pickupType === 'KORAIL_LOCKER';
  const { currentTime, days: day } = getCustomDate();
  const isWeekend = ['금', '토', '일'].includes(day);

  const initCalendar = () => {
    const { years, months, dates } = getCustomDate();

    const dateList = [];
    const firstWeek = [];

    for (let i = 0; i < TWO_WEEKS; i++) {
      const isFirstWeek = i < ONE_WEEK;

      const _month = new Date(years, months, dates + i).getMonth() + 1;
      const _date = new Date(years, months, dates + i).getDate();
      const _day = new Date(years, months, dates + i).getDay();
      const value = `${years}-${getFormatTime(_month)}-${getFormatTime(_date)}`;

      const dateObj = {
        years,
        month: _month,
        date: _date,
        day: _day,
        value,
        dayKor: WEEKS[_day],
      };

      dateList.push(dateObj);

      if (isFirstWeek) {
        firstWeek.push(dateObj);
      }
    }

    checkActiveDates(dateList, firstWeek, formatDisabledDate(dateList));
    setDateList(dateList);
  };

  const clickDayHandler = (value: string): void => {
    const isQuickAndSpot = ['spot', 'quick'].includes(userDeliveryType!);

    const selectedSubDelivery = subOrderDelivery?.find((item) =>
      isQuickAndSpot
        ? item.deliveryDetail === lunchOrDinner?.find((item) => item.isSelected)?.value && item.deliveryDate === value
        : item.deliveryDate === value
    );

    if (selectedSubDelivery && !isSheet) {
      goToSubDeliverySheet && goToSubDeliverySheet(selectedSubDelivery?.id);
    }

    changeDeliveryDate({ value, isChanged: false });
  };

  const formatDisabledDate = (dateList: IDateObj[]): string[] => {
    // 배송에 따른 기본 휴무일

    const isQuickAndSpot = ['spot', 'quick'].includes(userDeliveryType!);
    const isParcelAndMorning = ['parcel', 'morning'].includes(userDeliveryType!);
    const quickAndSpotDisabled = ['토', '일'];
    const parcelAndMorningDisabled = ['일', '월'];

    // 퀵/스팟 <-> 새벽/택배로 나뉨

    // 퀵/스팟 점심 9:30 후 선택 불가
    // 큇/스팟 저녁 11:00 후 선택 불가 -> 다음 날 active

    // 새벽/택배 17:00 이후 주문 마감

    const today = new Date().getDate();
    const nextDay = new Date().getDate() + 1;

    const isBeforeLunch = currentTime < 9.29;
    const isFinishLunch = currentTime >= 9.29;
    const isFinishDinner = currentTime >= 10.59;
    const isFinishParcelAndMorning = currentTime >= 16.59;

    let tempDisabledDate: string[] = [];

    try {
      switch (true) {
        case isQuickAndSpot && isLocker: {
          tempDisabledDate = pipe(
            dateList,
            filter(({ dayKor, date }: IDateObj) => {
              if (isWeekend) {
                return (
                  quickAndSpotDisabled.includes(dayKor) ||
                  date === today ||
                  (isBeforeLunch && date === nextDay) ||
                  (isFinishLunch && date === nextDay)
                );
              } else {
                return quickAndSpotDisabled.includes(dayKor) || (isFinishDinner && date === today);
              }
            }),
            map(({ value }: IDateObj) => value),
            toArray
          );
          break;
        }
        case isQuickAndSpot:
          {
            tempDisabledDate = pipe(
              dateList,
              filter(
                ({ dayKor, date }: IDateObj) =>
                  quickAndSpotDisabled.includes(dayKor) || (isFinishDinner && date === today)
              ),
              map(({ value }: IDateObj) => value),
              toArray
            );
          }
          break;
        case isParcelAndMorning:
          {
            tempDisabledDate = pipe(
              dateList,
              filter(
                ({ dayKor, date }: IDateObj) =>
                  parcelAndMorningDisabled.includes(dayKor) ||
                  date === today ||
                  (isFinishParcelAndMorning && date === nextDay)
              ),
              map(({ value }: IDateObj) => value),
              toArray
            );
          }
          break;
      }
    } catch (error) {
      console.error(error);
    }

    return tempDisabledDate;
  };

  const checkActiveDates = (dateList: IDateObj[], firstWeek: IDateObj[], customDisabledDates: string[] = []) => {
    // 서버에서 받은 disabledDates와 배송 타입별 customDisabledDates 합침

    const isOpenNextMonday = isWeekend && isLocker;
    const mergedDisabledDate = [...disabledDates, ...customDisabledDates]?.sort();
    const filteredActiveDates = firstWeek.filter((week: any) => !mergedDisabledDate.includes(week.value));
    const firstActiveDate = !isSpotAvailable ? '' : filteredActiveDates[0]?.value;
    const isDisabledDate = mergedDisabledDate.includes(selectedDay!);
    let totalDisabledDates = !isSpotAvailable
      ? [...mergedDisabledDate, ...filteredActiveDates.map((item) => item.value)]
      : mergedDisabledDate;

    if (isOpenNextMonday) {
      const restDates = dateList.filter((item, index) => index > 7);
      totalDisabledDates = [...totalDisabledDates, ...restDates.map((item) => item.value)];
    }

    /* 배송일 변경에서는 selectedDeliveryDay 주고 있음 */

    if (!isSheet) {
      const defaultActiveDate = selectedDay ?? firstActiveDate;

      // 배송 타입 변경 후 선택 날짜가 배송 불가일 때
      changeDeliveryDate({ value: isDisabledDate ? firstActiveDate : defaultActiveDate, isChanged: isDisabledDate });
    }

    checkHasSubInActiveDates(dateList, mergedDisabledDate);
    setCustomDisabledDate(totalDisabledDates);
    // 첫 번째 주에 배송 가능 날이 2일 이상인 경우
    checkShowMoreWeek(filteredActiveDates);
  };

  const checkShowMoreWeek = (list: IDateObj[]) => {
    if (list?.length > ACTIVE_DAY_OF_WEEK) {
      setIsShowMoreWeek(false);
    } else {
      setIsShowMoreWeek(true);
    }
  };

  const checkHasSubInActiveDates = (dateList: IDateObj[], disabledDate: string[]): void => {
    // 함께배송 안내는 오픈되어있는 주에서만 안내
    // 현재 캘린더 렌더되는 날짜 데이터를 1주,2주로 나누지 않고 있음
    // 휴무일과 겹치는 경우 체크

    const hasSubDeliveryInActiveDates = subOrderDelivery
      ?.filter((oItem) => {
        return dateList?.some((dItem, index) => {
          if (index >= ONE_WEEK) {
            return;
          }
          return dItem.value === oItem.deliveryDate;
        });
      })
      ?.filter((a) => !disabledDate.includes(a.deliveryDate));

    setSubDeliveryInActiveDates(hasSubDeliveryInActiveDates || []);
  };

  const subOrderDeliveryInfo = (): JSX.Element => {
    return (
      <TextB3R color={theme.greyScale65} padding="2px 0 0 4px">
        {subOrderDeliveryInActiveDates.length > 1
          ? '배송예정인 기존 주문이 있습니다. 함께배송 받으세요!'
          : `${new Date(
              subOrderDeliveryInActiveDates[0]?.deliveryDate
            ).getDate()}일에 배송예정인 기존 주문이 있습니다. 함께배송 받으세요!`}
      </TextB3R>
    );
  };

  const RenderCalendar = React.memo(
    ({ isShowMoreWeek, isSpotAvailable }: { isShowMoreWeek: boolean; isSpotAvailable?: boolean }): JSX.Element => {
      const { years, months, dates } = getCustomDate();

      const renderWeeks = () => {
        const weeks: string[] = [];
        for (let i = 0; i < ONE_WEEK; i++) {
          const _week = new Date(years, months, dates + i).getDay();
          if (WEEKS[_week]) {
            weeks.push(WEEKS[_week]);
          }
        }
        return weeks;
      };

      return (
        <Wrapper>
          <Header>
            {renderWeeks().map((week, index) => {
              return (
                <TextH5B color={theme.greyScale45} key={index}>
                  {week}
                </TextH5B>
              );
            })}
          </Header>
          <Body>
            {dateList.map((dateObj, index) => {
              const selectedDay = !isSpotAvailable ? false : selectedDeliveryDay === dateObj.value;

              if (!isShowMoreWeek) {
                if (index > LIMIT_DAYS) {
                  return;
                }
              }

              return (
                <Days
                  handler={clickDayHandler}
                  value={dateObj.value}
                  day={dateObj.date}
                  key={index}
                  selectedDay={selectedDay}
                  index={index}
                  disabledDates={customDisabledDate}
                  otherDeliveryInfo={subOrderDeliveryInActiveDates}
                />
              );
            })}
          </Body>
        </Wrapper>
      );
    }
  );

  RenderCalendar.displayName = 'RenderCalendar';

  useEffect(() => {
    initCalendar();
  }, [subOrderDelivery]);

  if (dateList.length === 0) {
    return <div></div>;
  }

  return (
    <FlexCol>
      <CalendarContainer isSheet={isSheet}>
        <RenderCalendar isShowMoreWeek={isShowMoreWeek} isSpotAvailable={isSpotAvailable} />
      </CalendarContainer>
      {subOrderDeliveryInActiveDates.length > 0 && (
        <FlexRow padding="16px 0 0 0">
          <SVGIcon name="brandColorDot" />
          {subOrderDeliveryInfo()}
        </FlexRow>
      )}
    </FlexCol>
  );
};

const CalendarContainer = styled.div<{ isSheet?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 512px;
  border-radius: ${({ isSheet }) => (isSheet ? 0 : 10)}px;
  background-color: ${theme.greyScale3};
`;

const Wrapper = styled.div`
  padding: 16px 0px 16px 0px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% / 7);
    margin-bottom: 10px;
  }
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;

export default React.memo(Calendar);
