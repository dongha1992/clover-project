import { CARD, MENT } from '@constants/quick';
import { INIT_TIMER, SET_TIMER_STATUS } from '@store/order';
import calculateArrival from '@utils/calculateArrival';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import getCustomDate from '@utils/getCustomDate';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { sprintf } from 'sprintf-js';
import useTimer from './useTimer';

interface ICard {
  title: string;
  dec: string;
  timer?: boolean;
}

const useQuickOrder = () => {
  const dispatch = useDispatch();
  const deliveryType = checkTimerLimitHelper();
  const { days } = getCustomDate(new Date());
  const [cardList, setCardList] = useState<ICard[]>();
  const [ment, setMent] = useState('');
  const [tooltipTime, setTooltipTime] = useState('');
  const now = dayjs();

  const { timer } = useTimer();

  useEffect(() => {
    switch (deliveryType) {
      case '스팟점심':
        // 0시 ~ 9시 (스팟점심)
        dispatch(INIT_TIMER({ isInitDelay: true }));
        setMent(MENT.type1);
        setCardList([CARD.lunch1, CARD.dinner1, CARD.dawn1, CARD.delivery1]);
        break;

      case '스팟점심타이머':
        // 9시 ~ 9시30분 (스팟점심 타이머)
        dispatch(INIT_TIMER({ isInitDelay: false }));
        dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
        setMent(MENT.type1);
        setTooltipTime('스팟점심');
        setCardList([CARD.lunch3, CARD.dinner1, CARD.dawn1, CARD.delivery1]);
        break;

      case '스팟저녁':
        // 9시30분 ~ 10시30분 (스팟저녁)
        dispatch(INIT_TIMER({ isInitDelay: true }));
        setMent(MENT.type2);
        setCardList([CARD.dinner1, CARD.dawn1, CARD.delivery1, CARD.lunch1]);
        break;

      case '스팟저녁타이머':
        // 10시30분 ~ 11시 (스팟저녁 타이머)
        dispatch(INIT_TIMER({ isInitDelay: false }));
        dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
        setMent(MENT.type2);
        setTooltipTime('스팟저녁');
        setCardList([CARD.dinner3, CARD.dawn1, CARD.delivery1, CARD.lunch1]);
        break;

      case '새벽택배':
        // 11시 ~ 16시30분 (새벽/택배 차일도착)
        dispatch(INIT_TIMER({ isInitDelay: true }));
        setMent(MENT.type3);
        setCardList([
          CARD.dawn1,
          CARD.delivery1,
          {
            title: CARD.lunch2.title,
            dec: sprintf(
              CARD.lunch2.dec,
              dayjs(String(calculateArrival(now.add(1, 'day').format('YYYY-MM-DD')))).format('DD')
            ),
          },
          {
            title: CARD.dinner2.title,
            dec: sprintf(
              CARD.dinner2.dec,
              dayjs(String(calculateArrival(now.add(1, 'day').format('YYYY-MM-DD')))).format('DD')
            ),
          },
        ]);
        break;
      case '새벽배송타이머':
        // 16시30분 ~ 17시 (새벽/택배 차일도착 타이머)
        dispatch(INIT_TIMER({ isInitDelay: false }));
        dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
        setMent(MENT.type3);
        setTooltipTime('새벽/택배');
        setCardList([
          CARD.dawn3,
          CARD.delivery3,
          {
            title: CARD.lunch2.title,
            dec: sprintf(
              CARD.lunch2.dec,
              dayjs(String(calculateArrival(now.add(1, 'day').format('YYYY-MM-DD')))).format('DD')
            ),
          },
          {
            title: CARD.dinner2.title,
            dec: sprintf(
              CARD.dinner2.dec,
              dayjs(String(calculateArrival(now.add(1, 'day').format('YYYY-MM-DD')))).format('DD')
            ),
          },
        ]);
        break;

      case '스팟점심N일':
        dispatch(INIT_TIMER({ isInitDelay: true }));
        setMent(MENT.type3);
        if (days === '일') {
          // 일요일 17시 ~ 24시 (스팟점심 차일도착)
          setCardList([
            CARD.lunch1,
            CARD.dinner1,
            {
              title: CARD.dawn2.title,
              dec: sprintf(
                CARD.dawn2.dec,
                dayjs(String(calculateArrival(now.add(2, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.delivery2.title,
              dec: sprintf(
                CARD.delivery2.dec,
                dayjs(String(calculateArrival(now.add(2, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
          ]);
        } else {
          // 월,화,수,목 17시 ~ 24시 (스팟점심 차일도착)
          setCardList([
            CARD.lunch1,
            CARD.dinner1,
            {
              title: CARD.dawn2.title,
              dec: sprintf(
                CARD.dawn2.dec,
                dayjs(String(calculateArrival(now.add(1, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.delivery2.title,
              dec: sprintf(
                CARD.delivery2.dec,
                dayjs(String(calculateArrival(now.add(1, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
          ]);
        }
        break;

      case '새벽택배N일':
        dispatch(INIT_TIMER({ isInitDelay: true }));
        setMent(MENT.type5);
        if (days === '금') {
          // 금요일 17시 ~ 24시 (새벽/택배 화요일)
          setCardList([
            {
              title: CARD.dawn2.title,
              dec: sprintf(
                CARD.dawn2.dec,
                dayjs(String(calculateArrival(now.add(4, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.delivery2.title,
              dec: sprintf(
                CARD.delivery2.dec,
                dayjs(String(calculateArrival(now.add(4, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.lunch2.title,
              dec: sprintf(
                CARD.lunch2.dec,
                dayjs(String(calculateArrival(now.add(3, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.dinner2.title,
              dec: sprintf(
                CARD.dinner2.dec,
                dayjs(String(calculateArrival(now.add(3, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
          ]);
        } else if (days === '토') {
          // 토요일 전체 (새벽/택배 화요일)
          setCardList([
            {
              title: CARD.dawn2.title,
              dec: sprintf(
                CARD.dawn2.dec,
                dayjs(String(calculateArrival(now.add(3, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.delivery2.title,
              dec: sprintf(
                CARD.delivery2.dec,
                dayjs(String(calculateArrival(now.add(3, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.lunch2.title,
              dec: sprintf(
                CARD.lunch2.dec,
                dayjs(String(calculateArrival(now.add(2, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.dinner2.title,
              dec: sprintf(
                CARD.dinner2.dec,
                dayjs(String(calculateArrival(now.add(2, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
          ]);
        } else if (days === '일') {
          // 일요일 0시 ~ 17시 (새벽/택배 화요일)
          setMent(MENT.type5);
          setCardList([
            {
              title: CARD.dawn2.title,
              dec: sprintf(
                CARD.dawn2.dec,
                dayjs(String(calculateArrival(now.add(2, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.delivery2.title,
              dec: sprintf(
                CARD.delivery2.dec,
                dayjs(String(calculateArrival(now.add(2, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.lunch2.title,
              dec: sprintf(
                CARD.lunch2.dec,
                dayjs(String(calculateArrival(now.add(1, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
            {
              title: CARD.dinner2.title,
              dec: sprintf(
                CARD.dinner2.dec,
                dayjs(String(calculateArrival(now.add(1, 'day').format('YYYY-MM-DD')))).format('DD')
              ),
            },
          ]);
        }
        break;

      default:
        break;
    }
  }, [deliveryType]);

  return { cardList, timer, ment, tooltipTime };
};
export default useQuickOrder;
