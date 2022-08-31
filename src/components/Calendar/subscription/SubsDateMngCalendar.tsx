import useCalendarTitleContent from '@hooks/subscription/useCalendarTitleContent';
import { afterDateN, dateN } from '@utils/common';
import { beforeDateN } from '@utils/common/dateHelper';
import 'dayjs/locale/ko';
dayjs.locale('ko');
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useDispatch } from 'react-redux';
import { SubsCalendarContainer } from './style';

interface IProps {
  orderDeliveries: any;
  firstDeliveryDate: string;
  lastDeliveryDate: string;
  deliveryComplete: any; // 배송 완료날짜
  sumDelivery: any;
  setSelectDate?: Dispatch<SetStateAction<Date | undefined>>;
  megCalendarSelectDate: string; // 배송변경 캘린더에서 선택 날짜
  deliveryChangeBeforeDate: string;
  deliveryType: string; // 배송 타입 PARCEL,MORNING,SPOT
}

const SubsDateMngCalendar = ({
  orderDeliveries,
  firstDeliveryDate,
  lastDeliveryDate,
  megCalendarSelectDate,
  deliveryChangeBeforeDate,
  deliveryComplete,
  sumDelivery,
  deliveryType,
  setSelectDate,
}: IProps) => {
  const dispatch = useDispatch();
  const today = dayjs().format('YYYY-MM-DD');
  const [value, setValue] = useState<Date>(new Date(megCalendarSelectDate));
  const [minDate, setMinDate] = useState<Date>(new Date(firstDeliveryDate));
  const [maxDate, setMaxDate] = useState<Date>(new Date(dayjs(lastDeliveryDate).add(7, 'day').format('YYYY-MM-DD')));

  useEffect(() => {
    setSelectDate && setSelectDate(value);
  }, []);

  const titleContent = useCalendarTitleContent({
    today,
    deliveryExpectedDate: orderDeliveries,
    deliveryComplete: deliveryComplete,
    sumDelivery: sumDelivery,
    calendarType: 'deliveryChange',
    deliveryChangeBeforeDate: deliveryChangeBeforeDate,
  });

  // 새벽 : 월 ~ 토 비활성(일)
  // 택배 : 화 ~ 토 비활성(일,월)
  // 스팟 : 월 ~ 금 비활성(일,토)

  console.log('===', dayjs().set('hour', 2).toDate());

  const tileDisabled = ({ date, view }: { date: any; view: any }) => {
    if (date.getDay() === 6) {
      // 토요일 비활성화(스팟)
      if (deliveryType === 'SPOT') {
        return true;
      }
    } else if (date.getDay() === 0) {
      // 일요일 비활성화(새벽/택배/스팟)
      return true;
    } else if (date.getDay() === 1) {
      // 월요일 비활성화(택배)
      if (deliveryType === 'PARCEL') {
        return true;
      }
    }

    // 오늘 7시 이후 비활성화
    if (dateN(date) === dateN(today) && Number(dayjs().format('Hmm')) > 700) {
      return true;
    }

    // 새벽/택배 D-1 7시 이후 비활성화
    if (
      (deliveryType === 'PARCEL' || deliveryType === 'MORNING') &&
      beforeDateN(date, 1) === dateN(today) &&
      Number(dayjs().format('Hmm')) > 700
    ) {
      return true;
    }

    if (
      dateN(date) >= dateN(today) &&
      dateN(firstDeliveryDate) <= dateN(date) &&
      afterDateN(lastDeliveryDate, 7) >= dateN(date)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onChange = (value: Date, event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);
    setSelectDate && setSelectDate(value);
  };

  return (
    <SubsCalendarContainer className="subsCalendar">
      <Calendar
        calendarType={'Hebrew'}
        prev2Label={null}
        next2Label={null}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onChange}
        value={value}
        formatDay={(locale, date) => dayjs(date).format('D')}
        tileContent={titleContent}
        tileDisabled={tileDisabled}
        locale="ko"
      />
    </SubsCalendarContainer>
  );
};

export default SubsDateMngCalendar;
