import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Days from './Days';
import { theme } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';

let WEEKS: any = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

interface ICalendar {
  disabledDates: number[];
}

/* TODO: 케이스 나누기, css 다시 해야하나.. */
/* TODO: 특수 케이스 별로 없어서 굳이 일주이주 나눠야 하나 */

function Calendar({ disabledDates }: ICalendar) {
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

    for (let i = 0; i < 14; i++) {
      const _date = new Date(year, month, date + i).getDate();
      list.push(_date);
    }
    setDateList(list);
  };

  const clickDayHandler = (index: number) => {
    setSelectedDay(index);
  };

  const showMoreWeeks = () => {
    setIsShowMoreWeek(true);
  };

  const RenderCalendar = (isShowMoreWeek: any): JSX.Element => {
    const { year, month, date } = getCalendarDate();

    const renderWeeks = () => {
      const weeks: string[] = [];
      for (let i = 0; i < 7; i++) {
        const _week = new Date(year, month, date + i).getDay();
        weeks.push(WEEKS[_week]);
      }
      return weeks;
    };

    return (
      <>
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
              if (index > 6) {
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
              />
            );
          })}
        </Body>
      </>
    );
  };

  return (
    <CalendarContainer>
      <RenderCalendar isShowMoreWeek={isShowMoreWeek} />
      <BtnContainer onClick={showMoreWeeks}>더보기</BtnContainer>
    </CalendarContainer>
  );
}

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

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
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

const BtnContainer = styled.div`
  position: absolute;
  right: 0%;
`;
export default React.memo(Calendar);
