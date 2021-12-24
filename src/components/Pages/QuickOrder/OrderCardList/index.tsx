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
  minutes: number;
  seconds: number;
  weeks: number;
  pushStatus: string;
}

const OrderCardList: React.FC<Props> = ({
  time,
  minutes,
  seconds,
  weeks,
  pushStatus,
}) => {
  const [cardList, setCardList] = useState<card[]>();
  const [timer, setTimer] = useState<string>('');

  let timerRef = useRef(1799);
  let timeCount = useRef<any>();

  useEffect(() => {
    switch (pushStatus) {
      case 'part1':
        setCardList([CARD.lunch1, CARD.dinner1, CARD.dawn1, CARD.delivery1]);

        if (time >= 9.0 && time < 9.3) {
          setCardList([CARD.lunch3, CARD.dinner1, CARD.dawn1, CARD.delivery1]);
          timerRef.current = getTimer();
          timeCount.current = setInterval(() => {
            timerHandler();
          }, 1000);
        }
        break;
      case 'part2':
        setCardList([CARD.dinner1, CARD.dawn1, CARD.delivery1, CARD.lunch1]);

        if (time > 10.3 && time < 11.0) {
          setCardList([CARD.dinner3, CARD.dawn1, CARD.delivery1, CARD.lunch1]);
          timerRef.current = getTimer();
          timeCount.current = setInterval(() => {
            timerHandler();
          }, 1000);
        }
        break;
      case 'part3':
        if (weeks === 0 || weeks === 6) {
          setCardList([CARD.dawn2, CARD.delivery2, CARD.lunch2, CARD.dinner2]);
        } else {
          setCardList([CARD.dawn1, CARD.delivery1, CARD.lunch2, CARD.dinner2]);
        }

        if (time > 16.3 && time < 17.0) {
          setCardList([CARD.dawn3, CARD.delivery3, CARD.lunch2, CARD.dinner2]);
          timerRef.current = getTimer();
          timeCount.current = setInterval(() => {
            timerHandler();
          }, 1000);
        }
        break;
      case 'part4':
        if (weeks === 5 || weeks === 6) {
          setCardList([CARD.dawn2, CARD.delivery2, CARD.lunch2, CARD.dinner2]);
        } else {
          setCardList([CARD.lunch1, CARD.dinner1, CARD.dawn2, CARD.delivery2]);
        }
        break;
      default:
        break;
    }

    return () => clearInterval(timeCount.current);
  }, [pushStatus, time, weeks]);

  useEffect(() => {
    if (timer === '00:00') {
      clearInterval(timeCount.current);
    }
  }, [timer]);

  const format = (t: number) => (t < 10 ? '0' + t : t + '');

  const getTimer = () => {
    if (minutes >= 30) {
      return Number(format(60 - minutes)) * 60 - seconds - 1;
    } else {
      return Number(format(30 - minutes)) * 60 - seconds - 1;
    }
  };

  const timerHandler = useCallback((): void => {
    const mm = Math.floor(timerRef.current / 60);
    const ss = Math.floor(timerRef.current % 60);

    const formatTime = (mm: number, ss: number) => {
      return `${format(mm)}:${format(ss)}`;
    };

    timerRef.current -= 1;
    setTimer(formatTime(mm, ss));
  }, []);

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
