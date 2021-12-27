import { TextB3R, TextH3B, TextH4B, TextH6B } from '@components/Shared/Text';
import { CARD } from '@constants/quick';
import { useInterval } from '@hooks/useInterval';
import { ScrollHorizonList, theme } from '@styles/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface card {
  title: string;
  dec: string;
  timer?: boolean;
}
interface Props {
  time: number;
  weeks: number;
  pushStatus: string;
  format: (vlaue: number) => void;
  getTimer: () => number;
  setTimer: (value: string) => void;
  timer: string;
}

const OrderCardList: React.FC<Props> = ({
  time,
  weeks,
  pushStatus,
  format,
  getTimer,
  setTimer,
  timer,
}) => {
  const [cardList, setCardList] = useState<card[]>();
  let timerRef = useRef<number>(1799);
  let timeCount = useRef<any>();

  useEffect(() => {
    return () => clearInterval(timeCount.current);
  }, []);

  useEffect(() => {
    clearInterval(timeCount.current);

    switch (pushStatus) {
      case 'part1':
        clearInterval(timeCount.current);
        setCardList([CARD.lunch1, CARD.dinner1, CARD.dawn1, CARD.delivery1]);

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
        setCardList([CARD.dinner1, CARD.dawn1, CARD.delivery1, CARD.lunch1]);

        if (time > 10.3 && time < 11.0) {
          setCardList([CARD.dinner3, CARD.dawn1, CARD.delivery1, CARD.lunch1]);
          timerRef.current = getTimer();
          timeCount.current = setInterval(() => {
            timerHandler();
          }, 100);
        }
        break;
      case 'part3':
        clearInterval(timeCount.current);
        if (weeks === 0 || weeks === 6) {
          setCardList([CARD.dawn2, CARD.delivery2, CARD.lunch2, CARD.dinner2]);
        } else {
          setCardList([CARD.dawn1, CARD.delivery1, CARD.lunch2, CARD.dinner2]);
        }

        if (time >= 16.3 && time < 17.0) {
          setCardList([CARD.dawn3, CARD.delivery3, CARD.lunch2, CARD.dinner2]);
          timerRef.current = getTimer();
          timeCount.current = setInterval(() => {
            timerHandler();
          }, 100);
        }
        break;
      case 'part4':
        clearInterval(timeCount.current);
        if (weeks === 5 || weeks === 6) {
          setCardList([CARD.dawn2, CARD.delivery2, CARD.lunch2, CARD.dinner2]);
        } else {
          setCardList([CARD.lunch1, CARD.dinner1, CARD.dawn2, CARD.delivery2]);
        }
        break;
      default:
        break;
    }
  }, [getTimer, pushStatus, time, weeks]);

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

  return (
    <CardList>
      <ScrollHorizonList>
        <ScrollHorizonListGroup>
          {cardList &&
            cardList.map((item, index) => (
              <Card key={index}>
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
