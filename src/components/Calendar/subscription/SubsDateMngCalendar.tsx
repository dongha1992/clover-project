import useCalendarTitleContent from '@hooks/subscription/useCalendarTitleContent';
import { SET_SUBS_CALENDAR_SELECT_ORDERS } from '@store/subscription';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
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
}

const SubsDateMngCalendar = ({
  orderDeliveries,
  firstDeliveryDate,
  lastDeliveryDate,
  megCalendarSelectDate,
  deliveryChangeBeforeDate,
  deliveryComplete,
  sumDelivery,
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

  const tileDisabled = ({ date, view }: { date: any; view: any }) => {
    if (
      Number(firstDeliveryDate.replaceAll('-', '')) < Number(dayjs(date).format('YYYY-MM-DD').replaceAll('-', '')) &&
      Number(lastDeliveryDate.replaceAll('-', '')) + 7 > Number(dayjs(date).format('YYYY-MM-DD').replaceAll('-', ''))
    ) {
      return false;
    } else {
      return false;
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
      />
    </SubsCalendarContainer>
  );
};

export default SubsDateMngCalendar;
