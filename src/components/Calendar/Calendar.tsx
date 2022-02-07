import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Days from './Days';
import { theme, FlexCol, FlexRow } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import getCustomDate from '@utils/getCustomDate';

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
  selectedDeliveryDay: number;
  setSelectedDeliveryDay: React.Dispatch<React.SetStateAction<number>>;
}

const Calendar = ({
  disabledDates,
  otherDeliveryDate,
  selectedDeliveryDay,
  setSelectedDeliveryDay,
}: ICalendar) => {
  const [dateList, setDateList] = useState<number[] | []>([]);
  const [isShowMoreWeek, setIsShowMoreWeek] = useState<boolean>(false);

  useEffect(() => {
    initCalendar();
  }, []);

  const initCalendar = () => {
    const { years, months, dates } = getCustomDate(new Date());

    const list = [];
    const firstWeek = [];

    for (let i = 0; i < 14; i++) {
      const _date = new Date(years, months, dates + i).getDate();
      const _day = new Date(years, months, dates + i).getDay();

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
    setSelectedDeliveryDay(index);
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
    const { years, months, dates } = getCustomDate(new Date());

    const renderWeeks = () => {
      const weeks: string[] = [];
      for (let i = 0; i < 7; i++) {
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
                selectedDay={selectedDeliveryDay === index}
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
