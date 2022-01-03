import { TextB3R, TextH3B, TextH4B, TextH6B } from '@components/Shared/Text';
import { CARD } from '@constants/quick';
import { cartForm } from '@store/cart';
import { ScrollHorizonList, theme } from '@styles/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import router from 'next/router';
import { SET_ORDER_TYPE } from '@store/order';
import { sprintf } from 'sprintf-js';
interface ICard {
  title: string;
  dec: string;
  timer?: boolean;
}
interface IProps {
  time: number;
  weeks: number;
  pushStatus: string;
  format: (vlaue: number) => void;
  getTimer: () => number;
  setTimer: (value: string) => void;
  timer: string;
}

const OrderCardList = ({
  time,
  weeks,
  pushStatus,
  format,
  getTimer,
  setTimer,
  timer,
}: IProps) => {
  const dispatch = useDispatch();
  const { cartLists } = useSelector(cartForm);
  const [cardList, setCardList] = useState<ICard[]>();
  let timerRef = useRef<number>(1799);
  let timeCount = useRef<any>();
  let today = new Date().getDate();
  const noList = [4, 5, 6];

  useEffect(() => {
    return () => clearInterval(timeCount.current);
  }, []);

  useEffect(() => {
    clearInterval(timeCount.current);

    switch (pushStatus) {
      case 'part1':
        clearInterval(timeCount.current);
        if (weeks === 6 || weeks === 0) {
          // 토,일 새벽/택배(화요일 도착)
          tuesdayArrival();
        } else {
          // 월~금 스팟점심(당일 도착)
          setCardList([CARD.lunch1, CARD.dinner1, CARD.dawn1, CARD.delivery1]);
        }

        if (time >= 9.0 && time < 9.3) {
          setCardList([CARD.lunch3, CARD.dinner1, CARD.dawn1, CARD.delivery1]);
          timerRef.current = getTimer();
          timeCount.current = setInterval(() => {
            timerHandler();
          }, 100);
        }
        break;
      case 'part2':
        clearInterval(timeCount.current);

        if (weeks === 6 || weeks === 0) {
          // 토,일 새벽/택배(화요일 도착)
          tuesdayArrival();
        } else {
          // 월~금 스팟저녁(당일 도착)
          setCardList([CARD.dinner1, CARD.dawn1, CARD.delivery1, CARD.lunch1]);
        }

        if (time >= 10.3 && time < 11.0) {
          setCardList([CARD.dinner3, CARD.dawn1, CARD.delivery1, CARD.lunch1]);
          timerRef.current = getTimer();
          timeCount.current = setInterval(() => {
            timerHandler();
          }, 100);
        }
        break;
      case 'part3':
        clearInterval(timeCount.current);
        if (weeks === 6 || weeks === 0) {
          // 토,일 새벽/택배(화요일 도착)
          tuesdayArrival();
        } else {
          // 월~금 새벽/택배(차일 도착)
          setCardList([
            CARD.dawn1,
            CARD.delivery1,
            {
              title: CARD.lunch2.title,
              dec: sprintf(CARD.lunch2.dec, calculateArrival(today + 1)),
            },
            {
              title: CARD.dinner2.title,
              dec: sprintf(CARD.dinner2.dec, calculateArrival(today + 1)),
            },
          ]);
        }

        if (time >= 16.3 && time < 17.0) {
          setCardList([
            CARD.dawn3,
            CARD.delivery3,
            {
              title: CARD.lunch2.title,
              dec: sprintf(CARD.lunch2.dec, calculateArrival(today + 1)),
            },
            {
              title: CARD.dinner2.title,
              dec: sprintf(CARD.dinner2.dec, calculateArrival(today + 1)),
            },
          ]);
          timerRef.current = getTimer();
          timeCount.current = setInterval(() => {
            timerHandler();
          }, 100);
        }
        break;
      case 'part4':
        clearInterval(timeCount.current);
        if (weeks === 5 || weeks === 6) {
          // 금,토 새벽/택배(화요일 도착)
          tuesdayArrival();
        } else {
          // 월~목,일 스팟점심(차일 도착)
          setCardList([
            CARD.lunch1,
            CARD.dinner1,
            {
              title: CARD.dawn2.title,
              dec: sprintf(CARD.dawn2.dec, calculateArrival(today + 1)),
            },
            {
              title: CARD.delivery2.title,
              dec: sprintf(CARD.delivery2.dec, calculateArrival(today + 1)),
            },
          ]);
        }
        break;
      default:
        break;
    }
  }, [pushStatus, time, weeks]);

  useEffect(() => {
    if (timer === '00:00') {
      clearInterval(timeCount.current);
    }
  }, [timer]);

  const timerHandler = useCallback((): void => {
    const mm = Math.floor(timerRef.current / 60);
    const ss = Math.floor(timerRef.current % 60);

    const formatTime = (mm: number, ss: number) => {
      return `${format(mm)}:${format(ss)}`;
    };

    timerRef.current = getTimer();

    setTimer(formatTime(mm, ss));
  }, [format, getTimer]);

  const cardClick = (item: ICard) => {
    const { title } = item;

    dispatch(SET_ORDER_TYPE({ orderType: title.split(' ')[0] }));

    cartLists.length === 0
      ? router.push(`/quickorder/category`)
      : router.push('/cart');
  };

  const tuesdayArrival = () => {
    switch (weeks) {
      case 5:
        setCardList([
          {
            title: CARD.dawn2.title,
            dec: sprintf(CARD.dawn2.dec, calculateArrival(today + 4)),
          },
          {
            title: CARD.delivery2.title,
            dec: sprintf(CARD.delivery2.dec, calculateArrival(today + 4)),
          },
          {
            title: CARD.lunch2.title,
            dec: sprintf(CARD.lunch2.dec, calculateArrival(today + 3)),
          },
          {
            title: CARD.dinner2.title,
            dec: sprintf(CARD.dinner2.dec, calculateArrival(today + 3)),
          },
        ]);
        break;
      case 6:
        setCardList([
          {
            title: CARD.dawn2.title,
            dec: sprintf(CARD.dawn2.dec, calculateArrival(today + 3)),
          },
          {
            title: CARD.delivery2.title,
            dec: sprintf(CARD.delivery2.dec, calculateArrival(today + 3)),
          },
          {
            title: CARD.lunch2.title,
            dec: sprintf(CARD.lunch2.dec, calculateArrival(today + 2)),
          },
          {
            title: CARD.dinner2.title,
            dec: sprintf(CARD.dinner2.dec, calculateArrival(today + 2)),
          },
        ]);
        break;
      case 0:
        setCardList([
          {
            title: CARD.dawn2.title,
            dec: sprintf(CARD.dawn2.dec, calculateArrival(today + 2)),
          },
          {
            title: CARD.delivery2.title,
            dec: sprintf(CARD.delivery2.dec, calculateArrival(today + 2)),
          },
          {
            title: CARD.lunch2.title,
            dec: sprintf(CARD.lunch2.dec, calculateArrival(today + 1)),
          },
          {
            title: CARD.dinner2.title,
            dec: sprintf(CARD.dinner2.dec, calculateArrival(today + 1)),
          },
        ]);
        break;
      default:
        break;
    }
  };

  const calculateArrival = (day: number) => {
    // 배송불가 날짜 제외 로직
    let rDay = day;
    for (let i = 0; i < noList.length; i++) {
      if (i === 0) {
        if (day !== noList[i]) {
          return day;
        }
      } else {
        if (rDay !== noList[i]) {
          return rDay;
        } else {
          if (i === noList.length - 1) {
            return noList[noList.length - 1] + 1;
          }
        }
      }
      rDay += 1;
    }
  };

  return (
    <CardList>
      <ScrollHorizonList>
        <ScrollHorizonListGroup>
          {cardList &&
            cardList.map((item, index) => (
              <Card
                key={index}
                onClick={() => {
                  cardClick(item);
                }}
              >
                <TextH4B>{item.title}</TextH4B>
                {item.timer ? (
                  <TextH6B color={theme.brandColor}>
                    {item.dec}
                    {timer} 전
                  </TextH6B>
                ) : (
                  <TextB3R>{item.dec}</TextB3R>
                )}
              </Card>
            ))}
        </ScrollHorizonListGroup>
      </ScrollHorizonList>
    </CardList>
  );
};

const CardList = styled.article`
  cursor: pointer;
  padding-left: 24px;
  padding-bottom: 50px;
`;
const Card = styled.article`
  display: flex;
  background-color: ${({ theme }) => theme.greyScale3};
  width: 243px;
  height: 98px;
  margin-right: 16px;
  padding-left: 24px;
  border-radius: 8px;
  flex-direction: column;
  justify-content: center;
  div:first-child {
    margin-bottom: 8px;
  }
`;

const ScrollHorizonListGroup = styled.div`
  display: flex;
  > div {
    width: 120px;
    height: 100%;
    margin-right: 16px;
    margin-bottom: 0;
  }
`;

export default OrderCardList;
