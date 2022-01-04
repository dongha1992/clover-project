import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Days from './Days';
import { theme, FlexCol, FlexRow } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';

let WEEKS: any = {
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

interface ICalendar {
  disabledDates: number[];
  otherDeliveryDate?: number;
}

const Calendar = ({ disabledDates, otherDeliveryDate }: ICalendar) => {
  const [dateList, setDateList] = useState<number[] | []>([]);
  const [isShowMoreWeek, setIsShowMoreWeek] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(0);

  useEffect(() => {
    initCalendar();
  }, []);

  const getCalendarDate = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();

    return { year, month, date };
  };

  const initCalendar = () => {
    const { year, month, date } = getCalendarDate();
    const list = [];
    const firstWeek = [];

    for (let i = 0; i < 14; i++) {
      const _date = new Date(year, month, date + i).getDate();
      const _day = new Date(year, month, date + i).getDay();

      const isFirstWeek = i < 7;

      // 일요일 제외 하고 push
      if (_day !== 0) {
        list.push(_date);
        if (isFirstWeek) {
          firstWeek.push(_date);
        }
      } else {
        continue;
      }
    }
    checkShowMoreWeek(firstWeek, disabledDates);
    setDateList(list);
  };

  const clickDayHandler = (index: number) => {
    setSelectedDay(index);
  };

  const checkShowMoreWeek = (firstWeek: number[], disabledDates: number[]) => {
    const filtered = firstWeek.filter(
      (week: any) => !disabledDates.includes(week)
    );

    // 첫 번째 주에 배송 가능 날이 2일 이상인 경우
    if (filtered.length > 2) {
      setIsShowMoreWeek(false);
    } else {
      setIsShowMoreWeek(true);
    }
  };

  const RenderCalendar = ({ isShowMoreWeek }: any): JSX.Element => {
    const { year, month, date } = getCalendarDate();

    const renderWeeks = () => {
      const weeks: string[] = [];
      for (let i = 0; i < 7; i++) {
        const _week = new Date(year, month, date + i).getDay();
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
          {dateList.map((day, index) => {
            if (!isShowMoreWeek) {
              if (index > 5) {
                return;
              }
            }
            return (
              <Days
                handler={clickDayHandler}
                day={day}
                key={day}
                selectedDay={selectedDay === index}
                index={index}
                disabledDates={disabledDates}
                otherDeliveryDate={otherDeliveryDate}
              />
            );
          })}
        </Body>
      </Wrapper>
    );
  };

  return (
    <FlexCol>
      <CalendarContainer>
        <RenderCalendar isShowMoreWeek={isShowMoreWeek} />
      </CalendarContainer>
      {otherDeliveryDate && (
        <FlexRow padding="16px 0 0 0">
          <SVGIcon name="brandColorDot" />
          <TextB3R color={theme.greyScale65} padding="2px 0 0 4px">
            13일에 배송예정인 주문이 있습니다. 함께 받아보세요!
          </TextB3R>
        </FlexRow>
      )}
    </FlexCol>
  );
};

const CalendarContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 512px;
  border-radius: 10px;
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
    width: calc(100% / 6);
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
