import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');
import { useCallback } from 'react';

interface IProps {
  today: string;
  calendarType?: string;
  deliveryExpectedDate: any;
  menuChangeDate?: any[] | null;
  deliveryHoliday?: string[];
  deliveryComplete?: string[];
  deliveryChange?: string[];
  sumDelivery?: any[];
  deliveryChangeBeforeDate?: string;
}

const useCalendarTitleContent = ({
  today,
  calendarType,
  deliveryExpectedDate,
  menuChangeDate,
  deliveryHoliday,
  deliveryComplete,
  deliveryChange,
  sumDelivery,
  deliveryChangeBeforeDate,
}: IProps) => {
  const titleContent = useCallback(
    ({ date, view }) => {
      let element = [];
      if (calendarType === 'deliveryChange' && deliveryChangeBeforeDate === dayjs(date).format('YYYY-MM-DD')) {
        // 배송일변경 시 변경전 날짜
        element.push(<div className="deliveryChangeBeforeDate" key={`00-${dayjs(date).format('YYYY-MM-DD')}`}></div>);
      }

      if (menuChangeDate?.find((x) => x.changed === true && x.deliveryDate === dayjs(date).format('YYYY-MM-DD'))) {
        element.push(
          <div className="menuChange" key={`11-${dayjs(date).format('YYYY-MM-DD')}`}>
            식단변경
          </div>
        );
      }

      if (deliveryExpectedDate?.find((x: any) => x.deliveryDate === dayjs(date).format('YYYY-MM-DD'))) {
        element.push(<div className="deliveryExpectedDate" key={`01-${dayjs(date).format('YYYY-MM-DD')}`}></div>);
      }

      if (
        today === dayjs(date).format('YYYY-MM-DD') &&
        deliveryChange?.findIndex((x) => x === dayjs(date).format('YYYY-MM-DD')) === -1
      ) {
        // 오늘
        element.push(
          <div className="today" key={`02-${dayjs(date).format('YYYY-MM-DD')}`}>
            오늘
          </div>
        );
      }

      if (deliveryHoliday?.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송 휴무일
        element.push(
          <div className="deliveryHoliday" key={`03-${dayjs(date).format('YYYY-MM-DD')}`}>
            배송휴무일
          </div>
        );
      }

      if (deliveryComplete?.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송완료 or 주문취소
        element.push(<div className="deliveryComplete" key={`04-${dayjs(date).format('YYYY-MM-DD')}`}></div>);
      }

      if (deliveryChange?.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송일변경
        element.push(
          <div className="deliveryChange" key={`05-${dayjs(date).format('YYYY-MM-DD')}`}>
            <span>배송일변경</span>
          </div>
        );
      }

      // TODO(young) : 합배송 테스트 필요
      if (sumDelivery?.find((x) => x.type === 'SUB' && x.deliveryDate === dayjs(date).format('YYYY-MM-DD'))) {
        // 배송예정일(합배송 포함)
        if (calendarType === 'deliveryChange') {
          if (dayjs(date).format('YYYY-MM-DD') !== deliveryExpectedDate[0].deliveryDate) {
            element.push(
              <div className="sumDelivery" key={`06-${dayjs(date).format('YYYY-MM-DD')}`}>
                <span></span>
              </div>
            );
          } else {
            element.push(
              <div className="sumDelivery delChange" key={`06-${dayjs(date).format('YYYY-MM-DD')}`}>
                <span></span>
              </div>
            );
          }
        } else {
          element.push(
            <div className="sumDelivery" key={`06-${dayjs(date).format('YYYY-MM-DD')}`}>
              <span></span>
            </div>
          );
        }
      }

      // TODO(young) : 합배송 테스트 필요
      if (
        sumDelivery?.find(
          (x) => x.type === 'SUB' && x.status === 'COMPLETED' && x.deliveryDate === dayjs(date).format('YYYY-MM-DD')
        )
      ) {
        // 배송완료(합배송 포함)
        element.push(
          <div className="sumDeliveryComplete" key={`07-${dayjs(date).format('YYYY-MM-DD')}`}>
            <span></span>
          </div>
        );
      }

      return <>{element}</>;
    },
    [
      calendarType,
      deliveryChange,
      deliveryChangeBeforeDate,
      deliveryComplete,
      deliveryExpectedDate,
      deliveryHoliday,
      menuChangeDate,
      sumDelivery,
      today,
    ]
  );
  return titleContent;
};

export default useCalendarTitleContent;
