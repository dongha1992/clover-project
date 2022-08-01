import { weeks } from '@constants/delivery-info';
import { useEffect, useState } from 'react';

interface IProps {
  placeOpenDays: string[];
  pickupDaysArr: string[];
  dayOfWeek: string;
  isAll: boolean;
}

const useSubsSpotOpenCheck = ({ placeOpenDays, pickupDaysArr, dayOfWeek, isAll }: IProps) => {
  const [isSubsSpot, setIsSubsSpot] = useState<boolean>();

  // 전체회차 배송지 변경시 변경할려는 날짜부터 구독종요일까지 스팟오픈안하는날이 포함되어있으면 변경불가
  useEffect(() => {
    const set = new Set(isAll ? pickupDaysArr : dayOfWeek);
    placeOpenDays?.forEach((day) => {
      set.delete(weeks[day]);
    });
    set.size === 0 ? setIsSubsSpot(true) : setIsSubsSpot(false);
  }, []);

  return isSubsSpot;
};
export default useSubsSpotOpenCheck;
