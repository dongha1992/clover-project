import { theme } from '@styles/theme';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import cloneDeep from 'lodash-es/cloneDeep';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useMutation } from 'react-query';
import { SET_SUBS_CALENDAR_SELECT_MENU, SET_SUBS_ORDER_MENUS, subscriptionForm } from '@store/subscription';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ISubsActiveDate } from '@model/index';
import { getSubscriptionApi } from '@api/menu';
import { SubsCalendarContainer } from '@components/Calendar/subscription/style';
import useCalendarTitleContent from '@hooks/subscription/useCalendarTitleContent';

dayjs.locale('ko');
interface IProps {
  subsActiveDates: any;
  disabledDate?: string[];
  deliveryComplete?: string[];
  deliveryExpectedDate?: any;
  setDeliveryExpectedDate?: Dispatch<SetStateAction<{ deliveryDate: string }[]>>;
  deliveryHoliday?: string[];
  deliveryChange?: string[];
  sumDelivery?: string[];
  setPickupDay?: (value: any[]) => void;
  setSelectDate?: Dispatch<SetStateAction<Date | undefined>>;
  menuChangeDate?: any[] | null;
  calendarType?: string | 'deliverySetting' | 'deliveryChange';
  subsPeriod?: string;
  menuId?: number;
  destinationId?: number;
}

const SubsCalendar = ({
  subsActiveDates, // 구독캘린더 active 날짜리스트(getSubscriptionApi로 가져온 선택가능한 날짜)
  disabledDate = [], // 구독캘린더 inactive 날짜리스트
  deliveryComplete = [], // 배송완료 or 주문취소
  deliveryExpectedDate = [], // 배송예정일
  setDeliveryExpectedDate, // 배송예정일 setState
  deliveryHoliday = [], // 배송휴무일
  deliveryChange = [], // 배송일변경
  sumDelivery = [], // 배송예정일(합배송 포함)
  setPickupDay, // 구독 플랜 단계에서 픽업 날짜
  setSelectDate, // 선택한 날짜
  menuChangeDate = [], // 식단 변경 날짜
  calendarType, // 캘린더 타입
  subsPeriod,
  menuId, // 구독조회할 메뉴 id
  destinationId, // 구독조회할 destinationId
}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { subsOrderMenus, subsCalendarSelectMenu, subsDeliveryExpectedDate } = useSelector(subscriptionForm);
  const today = dayjs().format('YYYY-MM-DD');
  const [value, setValue] = useState<Date>();
  const [minDate, setMinDate] = useState<Date>(new Date(subsActiveDates[0]?.deliveryDate));
  const [maxDate, setMaxDate] = useState<Date>(new Date(subsActiveDates[subsActiveDates.length - 1]?.deliveryDate));

  useEffect(() => {
    if (subsActiveDates.length !== 0) {
      mutateSelectDate(dayjs(minDate).format('YYYY-MM-DD'));
      setValue(minDate);
    }
    if (router.pathname === '/subscription/register') {
    } else if (subsDeliveryExpectedDate) {
      // TODO : 꼭 해야만 하는가 확인 필요
      mutateSelectDate(subsDeliveryExpectedDate[0].deliveryDate);
    }
  }, []);

  useEffect(() => {
    if (subsDeliveryExpectedDate) {
      // 선택한 날짜가 이미 있다면 선택한 날짜로 캘린더 선택
      if (calendarType !== 'deliverySetting' && subsCalendarSelectMenu) {
        setValue(new Date(subsCalendarSelectMenu.deliveryDate));
      } else {
        setValue(new Date(subsDeliveryExpectedDate[0].deliveryDate));
      }

      if (
        Number(subsActiveDates[subsActiveDates.length - 1].deliveryDate.replaceAll('-', '')) <=
        Number(subsDeliveryExpectedDate[subsDeliveryExpectedDate.length - 1].deliveryDate.replaceAll('-', ''))
      ) {
        setMaxDate(new Date(subsDeliveryExpectedDate[subsDeliveryExpectedDate.length - 1].deliveryDate));
      }
    }
  }, [subsDeliveryExpectedDate]);

  useEffect(() => {
    // 배송일 변경시 변경할려는 날짜에 합배송이 있을경우
    if (sumDelivery.find((x) => x === subsActiveDates[0].deliveryDate)) {
    }
  }, []);

  const titleContent = useCalendarTitleContent({
    today,
    calendarType,
    deliveryExpectedDate,
    menuChangeDate,
    deliveryHoliday,
    deliveryComplete,
    deliveryChange,
    sumDelivery,
  });

  const tileDisabled = ({ date, view }: { date: any; view: any }) => {
    if (!subsActiveDates?.find((x: any) => x.deliveryDate === dayjs(date).format('YYYY-MM-DD'))) {
      return true;
    }
    if (date.getDay() === 0) {
      // 일요일 비활성화
      return true;
    } else if (disabledDate.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
      // 비활성 날짜
      return true;
    } else {
      return false;
    }
  };

  const { mutate: mutateSelectDate } = useMutation(
    async (date: string) => {
      const params = {
        id: menuId!,
        destinationId: destinationId!,
        subscriptionPeriod: subsPeriod!,
        deliveryStartDate: date,
      };
      const { data } = await getSubscriptionApi(params);

      return data.data.menuTables;
    },
    {
      onSuccess: async (data) => {
        let dates: { deliveryDate: string }[] = [];
        let pickupDayObj = new Set();

        data.map((item: any) => {
          dates.push({ deliveryDate: item.deliveryDate });
          pickupDayObj.add(dayjs(item.deliveryDate).format('dd'));
          item.changed = false;
        });

        setDeliveryExpectedDate && setDeliveryExpectedDate(dates);

        if (
          Number(subsActiveDates[subsActiveDates.length - 1].deliveryDate.replaceAll('-', '')) <=
          Number(dates[dates.length - 1].deliveryDate.replaceAll('-', ''))
        ) {
          setMaxDate(new Date(dates[dates.length - 1].deliveryDate));
        }
        // 픽업 요일
        setPickupDay && setPickupDay(Array.from(pickupDayObj));

        dispatch(SET_SUBS_CALENDAR_SELECT_MENU(data[0]));
        dispatch(SET_SUBS_ORDER_MENUS(data));
      },
      onSettled: () => {},
      onError: () => {
        console.log('error');
      },
    }
  );

  const dateSelect = (date: string) => {
    const data = cloneDeep(subsOrderMenus);
    dispatch(SET_SUBS_CALENDAR_SELECT_MENU(data?.filter((item) => item.deliveryDate === date)[0]));
  };

  const onChange = (value: Date, event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);
    // TODO(young) : 구독 리스트 정보 받는 api
    if (router.pathname === '/subscription/set-info') {
      mutateSelectDate(dayjs(value).format('YYYY-MM-DD'));
    } else if (router.pathname === '/subscription/register') {
      dateSelect(dayjs(value).format('YYYY-MM-DD'));
    }
    if (setSelectDate) {
      setSelectDate(value);
    }
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
        // showNeighboringMonth={false}
        formatDay={(locale, date) => dayjs(date).format('D')}
        tileContent={titleContent}
        tileDisabled={tileDisabled}
      />
    </SubsCalendarContainer>
  );
};

export default SubsCalendar;
