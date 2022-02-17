import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Days from './Days';
import { theme, FlexCol, FlexRow } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import getCustomDate from '@utils/getCustomDate';
import { Obj } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { destinationForm } from '@store/destination';
import { filter, flow, map } from 'lodash/fp';

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
  disabledDates = [],
  otherDeliveryDate = [],
  selectedDeliveryDay,
  setSelectedDeliveryDay,
  isSheet,
  goToTogetherDelivery,
}: ICalendar) => {
  const [dateList, setDateList] = useState<IDateObj[]>([]);
  const [isShowMoreWeek, setIsShowMoreWeek] = useState<boolean>(false);
  const [customDisabledDate, setCustomDisabledDate] = useState<string[]>([]);

  const { userDestinationStatus } = useSelector(destinationForm);
  const dispatch = useDispatch();

  const initCalendar = () => {
    const { years, months, dates } = getCustomDate(new Date());

    const dateList = [];
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

      dateList.push(dateObj);

      if (isFirstWeek) {
        firstWeek.push(dateObj);
      }
    }

    checkActiveDates(firstWeek, formatDisabledDate(dateList));
    setDateList(dateList);
  };

  const clickDayHandler = (value: string) => {
    /*TODO: otherDeliveryDate 배열 --> 다형성 */

    const clickTogetherDelivery = otherDeliveryDate.includes(value);

    if (clickTogetherDelivery && !isSheet) {
      goToTogetherDelivery && goToTogetherDelivery();
    }

    setSelectedDeliveryDay(value);
  };

  const formatDisabledDate = (dateList: IDateObj[]): string[] => {
    // 배송에 따른 기본 휴무일
    const isQuickAndSpot = ['spot', 'quick'].includes(userDestinationStatus);
    const isParcelAndMorning = ['parcel', 'morning'].includes(userDestinationStatus);
    const quickAndSpotDisabled = ['토', '일'];
    const parcelAndMorningDisabled = ['일', '월'];

    // 퀵/스팟 <-> 새벽/택배로 나뉨

    // 퀵/스팟 점심 9:30 후 선택 불가
    // 큇/스팟 저녁 11:00 후 선택 불가 -> 다음 날 active

    // 새벽/택배 17:00 이후 주문 마감

    const { currentTime } = getCustomDate(new Date());
    const today = new Date().getDate();

    const isFinishLunch = currentTime >= 9.29;
    const isFinishDinner = currentTime >= 10.59;
    const isFinishParcelAndMorning = currentTime >= 16.59;

    let tempDisabledDate: string[] = [];

    try {
      switch (true) {
        case isQuickAndSpot:
          {
            tempDisabledDate = flow(
              filter(
                ({ dayKor, date }: IDateObj) =>
                  quickAndSpotDisabled.includes(dayKor) || (isFinishDinner && date === today)
              ),
              map(({ value }: IDateObj) => value)
            )(dateList);
          }
          break;
        case isParcelAndMorning:
          {
            tempDisabledDate = flow(
              filter(({ dayKor, date }: IDateObj) => parcelAndMorningDisabled.includes(dayKor) || date === today),
              map(({ value }: IDateObj) => value)
            )(dateList);
          }
          break;
      }
    } catch (error) {
      console.error(error);
    }

    return tempDisabledDate;
  };

  const checkActiveDates = (firstWeek: IDateObj[], customDisabledDates: string[] = []) => {
    // 서버에서 받은 disabledDates와 배송 타입별 customDisabledDates 합침
    const mergedDisabledDate = [...disabledDates, ...customDisabledDates].sort();

    const filtered = firstWeek.filter((week: any) => !mergedDisabledDate.includes(week.value));
    const firstActiveDate = filtered[0].value;

    setSelectedDeliveryDay(firstActiveDate);
    setCustomDisabledDate(mergedDisabledDate);

    // 첫 번째 주에 배송 가능 날이 2일 이상인 경우
    if (filtered.length > ACTIVE_DAY_OF_WEEK) {
      setIsShowMoreWeek(false);
    } else {
      setIsShowMoreWeek(true);
    }
  };

  const togetherInfo = () => {
    return (
      <TextB3R color={theme.greyScale65} padding="2px 0 0 4px">
        {otherDeliveryDate.length > 1
          ? '배송예정인 기존 주문이 있습니다. 함께배송 받으세요!'
          : `${otherDeliveryDate}일에 배송예정인 기존 주문이 있습니다. 함께배송 받으세요!`}
      </TextB3R>
    );
  };

  const RenderCalendar = React.memo(({ isShowMoreWeek }: { isShowMoreWeek: boolean }): JSX.Element => {
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
                disabledDates={customDisabledDate}
                otherDeliveryDate={otherDeliveryDate}
              />
            );
          })}
        </Body>
      </Wrapper>
    );
  });

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
          {togetherInfo()}
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
