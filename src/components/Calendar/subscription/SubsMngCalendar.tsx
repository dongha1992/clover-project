import useCalendarTitleContent from '@hooks/subscription/useCalendarTitleContent';
import { SET_SUBS_CALENDAR_SELECT_ORDERS, SET_SUBS_MANAGE, subscriptionForm } from '@store/subscription';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { SubsCalendarContainer } from './style';
interface IProps {
  orderDeliveries: any;
}
const SubsMngCalendar = ({ orderDeliveries }: IProps) => {
  const dispatch = useDispatch();
  const { subsManage } = useSelector(subscriptionForm);
  const today = dayjs().format('YYYY-MM-DD');
  const [value, setValue] = useState<Date>(new Date(dayjs(orderDeliveries[0].deliveryDate).format('YYYY-MM-DD')));
  const [minDate, setMinDate] = useState<Date>(new Date(orderDeliveries[0]?.deliveryDate));
  const [maxDate, setMaxDate] = useState<Date>(new Date(orderDeliveries[orderDeliveries.length - 1]?.deliveryDate));
  const [deliveryChange, setDeliveryChange] = useState([]);

  useEffect(() => {
    // 컴포넌트 unmount나 새로고침시 변경된날짜 state 초기화
    dispatch(SET_SUBS_MANAGE({ changeDate: null }));
    return () => {
      dispatch(SET_SUBS_MANAGE({ changeDate: null }));
    };
  }, []);

  useEffect(() => {
    if (subsManage?.changeDate) {
      setValue(new Date(subsManage?.changeDate));
      dateSelect(subsManage?.changeDate);
    } else {
      // setValue(new Date(dayjs(orderDeliveries[0].deliveryDate).format('YYYY-MM-DD')));
      dateSelect(dayjs(value).format('YYYY-MM-DD'));
    }

    // TODO(young): 계속 forEach가 곳곳에서 쓰이고 있는게 좋은지...?? 리팩토링 필요해보임
    let arr: any = [];
    orderDeliveries.forEach((o: any) => {
      if (o.deliveryDateChangeCount > 0) {
        arr.push(o.deliveryDate);
      }
    });
    setDeliveryChange(arr);
  }, [orderDeliveries, subsManage]);

  useEffect(() => {
    setMaxDate(new Date(orderDeliveries[orderDeliveries.length - 1]?.deliveryDate));
  }, [orderDeliveries]);

  const titleContent = useCalendarTitleContent({
    today,
    deliveryExpectedDate: orderDeliveries,
    deliveryChange: deliveryChange,
  });

  const tileDisabled = useCallback(
    ({ date, view }: { date: any; view: any }) => {
      if (!orderDeliveries?.find((x: any) => x.deliveryDate === dayjs(date).format('YYYY-MM-DD'))) {
        return true;
      } else {
        return false;
      }
    },
    [orderDeliveries]
  );

  const dateSelect = (date: string) => {
    const data = cloneDeep(orderDeliveries);
    dispatch(SET_SUBS_CALENDAR_SELECT_ORDERS(data?.filter((item: any) => item.deliveryDate === date)));
  };

  const onChange = (value: Date, event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);
    dateSelect(dayjs(value).format('YYYY-MM-DD'));
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
export default SubsMngCalendar;
