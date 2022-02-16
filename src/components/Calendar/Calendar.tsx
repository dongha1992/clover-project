import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Days from './Days';
import { theme, FlexCol, FlexRow } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import getCustomDate from '@utils/getCustomDate';

let WEEKS: any = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

const ONE_WEEK = 7;
const TWO_WEKKS = 14;
const ACTIVE_DAY_OF_WEEK = 2;
export const LIMIT_DAYS = 6;

/* TODO: 쓰이는 캘린더 3개 -> 분리해야하나 */
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
  otherDeliveryDate?: string[];
  selectedDeliveryDay: string;
  setSelectedDeliveryDay: React.Dispatch<React.SetStateAction<string>>;
  isSheet?: boolean;
  goToTogetherDelivery?: () => void;
}

const Calendar = ({
  disabledDates,
  otherDeliveryDate,
  selectedDeliveryDay,
  setSelectedDeliveryDay,
  isSheet,
  goToTogetherDelivery,
}: ICalendar) => {
  const [dateList, setDateList] = useState<IDateObj[] | []>([]);
  const [isShowMoreWeek, setIsShowMoreWeek] = useState<boolean>(false);

  const initCalendar = () => {
    const { years, months, dates } = getCustomDate(new Date());

    const list = [];
    const firstWeek = [];

    for (let i = 0; i < TWO_WEKKS; i++) {
      const isFirstWeek = i < ONE_WEEK;

      const _month = new Date(years, months, dates + i).getMonth() + 1;
      const _date = new Date(years, months, dates + i).getDate();
      const _day = new Date(years, months, dates + i).getDay();
      const value = `${years}-${_month < 10 ? `0${_month}` : _month}-${_date < 10 ? `0${_date}` : _date}`;

      const dateObj = {
        years,
        month: _month,
        date: _date,
        day: _day,
        value,
        dayKor: WEEKS[_day],
      };

      list.push(dateObj);

      if (isFirstWeek) {
        firstWeek.push(dateObj);
      }
    }
    checkShowMoreWeek(firstWeek, disabledDates);
    setDateList(list);
  };

  const clickDayHandler = (value: string) => {
    /*TODO: otherDeliveryDate 배열 --> 다형성 */
    const otherDate = otherDeliveryDate! && otherDeliveryDate[0];

    if (value === otherDate && !isSheet) {
      goToTogetherDelivery && goToTogetherDelivery();
    }

    setSelectedDeliveryDay(value);
  };

  const checkShowMoreWeek = (firstWeek: IDateObj[], disabledDates: string[]) => {
    const filtered = firstWeek.filter((week: any) => !disabledDates.includes(week.value));
    const firstActiveDate = filtered[0].value;
    setSelectedDeliveryDay(firstActiveDate);

    // 첫 번째 주에 배송 가능 날이 2일 이상인 경우 (일요일 제외 6일 중)
    if (filtered.length - 1 > ACTIVE_DAY_OF_WEEK) {
      setIsShowMoreWeek(false);
    } else {
      setIsShowMoreWeek(true);
    }
  };

  const RenderCalendar = ({ isShowMoreWeek }: { isShowMoreWeek: boolean }): JSX.Element => {
    const { years, months, dates } = getCustomDate(new Date());

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
            const selectedDay = selectedDeliveryDay === dateObj.value;
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
                disabledDates={disabledDates}
                otherDeliveryDate={otherDeliveryDate}
                dayKor={dateObj.dayKor}
              />
            );
          })}
        </Body>
      </Wrapper>
    );
  };

  useEffect(() => {
    initCalendar();
  }, []);

  return (
    <FlexCol>
      <CalendarContainer isSheet={isSheet}>
        <RenderCalendar isShowMoreWeek={isShowMoreWeek} />
      </CalendarContainer>
      {otherDeliveryDate && (
        <FlexRow padding="16px 0 0 0">
          <SVGIcon name="brandColorDot" />
          <TextB3R color={theme.greyScale65} padding="2px 0 0 4px">
            {otherDeliveryDate}일에 배송예정인 주문이 있습니다. 함께 받아보세요!
          </TextB3R>
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
  padding: 18px 0px 0px 0px;
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
