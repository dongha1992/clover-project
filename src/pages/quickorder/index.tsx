import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { TextB2R, TextH2B, TextH3B } from '@components/Shared/Text';
import { ScrollHorizonList, theme } from '@styles/theme';
import { BASE_URL } from '@constants/mock';
import ReOrderList from '@components/Pages/QuickOrder/ReOrderList';
import OrderCardList from '@components/Pages/QuickOrder/OrderCardList';
import { MENT } from '@constants/quick';
import { TimerTooltip } from '@components/Shared/Tooltip';
import { Button } from '@components/Shared/Button';
import { HorizontalItem } from '@components/Item';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { orderForm } from '@store/order';
dayjs.locale('ko');

const QuickOrderPage = () => {
  const { isTimerTooltip } = useSelector(orderForm);
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const weeks = new Date().getDay();

  /* 임시 */
  const [user] = useState(true);
  const [list] = useState([1]);
  const noList: string | any[] = ['2022-01-1', '2022-01-2', '2022-01-10'];

  const [itemList, setItemList] = useState([]);

  const [night, setNight] = useState<Boolean>();
  const [time, setTime] = useState<number>(Number(`${hours}.${minutes}`));
  const [pushStatus, setPushStatus] = useState('');
  const [ment, setMent] = useState('');
  const [tooltipMsg, setTooltipMsg] = useState('');
  const [tooltipShow, setTooltipShow] = useState(true);
  const [timer, setTimer] = useState<string>('');
  const [arrivalDate, setArrivalDate] = useState({
    lunch: { type: 'lunch', msg: '' },
    dinner: { type: 'dinner', msg: '' },
    morning: { type: 'morning', msg: '' },
    parcel: { type: 'parcel', msg: '' },
  });

  /* 목업 데이터 로직 */
  useEffect(() => {
    axios.get(`${BASE_URL}`).then(({ data }) => {
      setItemList(data);
    });
  }, []);
  /* 목업 데이터 로직 END */

  useEffect(() => {
    // setTime(Number(`${hours}.${format(minutes)}`));
    setTime(Number(`09.01`));

    if (hours >= 6 && hours < 18) {
      setNight(false);
    } else {
      setNight(true);
    }

    if (time >= 0 && time < 9.3) {
      // 24시 ~ 9시30분
      setPushStatus('part1');
      weeks === 6 || weeks === 0 ? setMent(MENT.type5) : setMent(MENT.type1);
    } else if (time >= 9.3 && time < 11.0) {
      // 9시30분 ~ 11시
      setPushStatus('part2');
      weeks === 6 || weeks === 0 ? setMent(MENT.type5) : setMent(MENT.type2);
    } else if (time >= 11.0 && time < 17.0) {
      // 11시 ~ 17시
      setPushStatus('part3');
      weeks === 6 || weeks === 0 ? setMent(MENT.type5) : setMent(MENT.type3);
    } else {
      // 17시 ~ 24시
      setPushStatus('part4');
      weeks === 5 || weeks === 6 ? setMent(MENT.type5) : setMent(MENT.type3);
    }
  }, [hours, minutes, time, ment]);

  useEffect(() => {
    switch (true) {
      case [1, 2, 3, 4].includes(weeks):
        // 월 ~ 목

        setArrivalDate({
          lunch: { ...arrivalDate['lunch'], msg: '픽업 12:00-12:30' },
          dinner: { ...arrivalDate['dinner'], msg: '픽업 17:00-17:30' },
          morning: { ...arrivalDate['morning'], msg: '다음날 배송' },
          parcel: { ...arrivalDate['parcel'], msg: '다음날 배송' },
        });
        break;

      case [5].includes(weeks):
        // 금
        setArrivalDate({
          lunch: { ...arrivalDate['lunch'], msg: '픽업 12:00-12:30' },
          dinner: { ...arrivalDate['dinner'], msg: '픽업 17:00-17:30' },
          morning: { ...arrivalDate['morning'], msg: '다음날 배송' },
          parcel: { ...arrivalDate['parcel'], msg: '다음날 배송' },
        });
        break;
      case [6].includes(weeks):
        // 토
        setArrivalDate({
          lunch: {
            ...arrivalDate['lunch'],
            msg: `다음주 (${
              dayjs(
                calculateArrival(dayjs().add(2, 'day').format('YYYY-MM-DD'))
              ).format('dddd')[0]
            }) 픽업 12:00-12:30`,
          },
          dinner: {
            ...arrivalDate['dinner'],
            msg: `다음주 (${
              dayjs(
                calculateArrival(dayjs().add(2, 'day').format('YYYY-MM-DD'))
              ).format('dddd')[0]
            }) 픽업 17:00-17:30`,
          },
          morning: {
            ...arrivalDate['morning'],
            msg: `다음주 (${
              dayjs(
                calculateArrival(dayjs().add(3, 'day').format('YYYY-MM-DD'))
              ).format('dddd')[0]
            }) 배송`,
          },
          parcel: {
            ...arrivalDate['parcel'],
            msg: `다음주 (${
              dayjs(
                calculateArrival(dayjs().add(3, 'day').format('YYYY-MM-DD'))
              ).format('dddd')[0]
            }) 배송`,
          },
        });
        break;

      case [0].includes(weeks):
        // 일
        setArrivalDate({
          lunch: {
            ...arrivalDate['lunch'],
            msg: `이번주 (${
              dayjs(
                calculateArrival(dayjs().add(1, 'day').format('YYYY-MM-DD'))
              ).format('dddd')[0]
            }) 픽업 12:00-17:30`,
          },
          dinner: {
            ...arrivalDate['dinner'],
            msg: `이번주 (${
              dayjs(
                calculateArrival(dayjs().add(1, 'day').format('YYYY-MM-DD'))
              ).format('dddd')[0]
            }) 픽업 17:00-17:30`,
          },
          morning: {
            ...arrivalDate['morning'],
            msg: `이번주 (${
              dayjs(
                calculateArrival(dayjs().add(2, 'day').format('YYYY-MM-DD'))
              ).format('dddd')[0]
            }) 픽업 17:00-17:30`,
          },
          parcel: {
            ...arrivalDate['parcel'],
            msg: `이번주 (${
              dayjs(
                calculateArrival(dayjs().add(2, 'day').format('YYYY-MM-DD'))
              ).format('dddd')[0]
            }) 배송`,
          },
        });

        break;
    }
  }, []);

  useEffect(() => {
    msgHandler();
  }, [timer]);

  const format = (t: number) => (t < 10 ? '0' + t : t + '');

  const getTimer = () => {
    if (new Date().getMinutes() >= 30) {
      return (60 - new Date().getMinutes()) * 60 - new Date().getSeconds();
    } else {
      return (30 - new Date().getMinutes()) * 60 - new Date().getSeconds();
    }
  };

  const msgHandler = () => {
    setTooltipMsg(`${pushStatus} 마감 ${timer} 전`);
  };

  const calculateArrival = (day: string) => {
    // 배송불가 날짜 제외 로직

    let rDay = day;
    let start = false;

    if (noList.length === 0) {
      // 배송불가 날짜가 없는 경우
      return dayjs(day).format('YYYY-MM-DD');
    } else {
      for (let i = 0; i < noList.length; i++) {
        if (noList[i] === rDay) {
          start = true;
          rDay = dayjs(rDay).add(1, 'day').format('YYYY-MM-DD');
          if (i === noList.length - 1) {
            // 배송불가 날짜 제외한 도착날짜 (배송불가 날짜 Array 전체 제외)
            return dayjs(rDay).format('YYYY-MM-DD');
          }
        } else {
          if (start) {
            // 배송불가 날짜 제외한 도착날짜
            return dayjs(rDay).format('YYYY-MM-DD');
          }
          if (i === noList.length - 1 && rDay === day) {
            // 도착날짜에 배송불가 날짜가 없을 경우
            return dayjs(day).format('YYYY-MM-DD');
          }
        }
      }
    }
  };

  return (
    <Container>
      <GreetingArticle>
        <TextBox>
          {user ? (
            <TextH2B>
              <span>루이스</span>님{`\n`}
              {list.length !== 0 ? ment : '내일 아침도 미리미리!'}
            </TextH2B>
          ) : (
            <TextH2B>
              <span>예비프코 고객</span>님{`\n`}
              내일 아침도 미리미리!
            </TextH2B>
          )}
        </TextBox>
        <IconBox>{night ? '달' : '태양'}</IconBox>
      </GreetingArticle>

      <OrderCardList
        time={time}
        weeks={weeks}
        pushStatus={pushStatus}
        format={format}
        getTimer={getTimer}
        timer={timer}
        setTimer={setTimer}
        calculateArrival={calculateArrival}
      />

      <PushArticle>
        {!user || list.length === 0 ? (
          <TextH3B padding="0 0 8px 0">신규 고객을 위한 아침</TextH3B>
        ) : (
          <TextH3B padding="0 0 18px 0">
            이전에 구매한 상품으로 또 먹을래요!
          </TextH3B>
        )}

        {!user || list.length === 0 ? (
          <TextB2R color={theme.greyScale65} padding="0 0 18px 0">
            <span>새벽배송</span> 17시까지 주문 시 다음날 새벽 7시 전 도착
          </TextB2R>
        ) : null}

        <ScrollHorizonList>
          <ScrollHorizonListGroup className="pushSHLG">
            {itemList.map((item, index) => (
              <HorizontalItem item={item} key={index} isQuick />
            ))}
          </ScrollHorizonListGroup>
        </ScrollHorizonList>

        {!user || list.length === 0 ? (
          <div className="btnWraper">
            <Button
              margin="24px 0 0"
              border
              backgroundColor="#fff"
              color={theme.black}
            >
              전체 상품 첫 주문하기
            </Button>
          </div>
        ) : null}
      </PushArticle>

      <Banner>신규서비스 소개</Banner>

      {!user || list.length !== 0 ? (
        <ReOrderList
          pushStatus={pushStatus}
          weeks={weeks}
          time={time}
          arrivalDate={arrivalDate}
        >
          {isTimerTooltip && (
            <TimerTooltip
              bgColor={theme.brandColor}
              color={'#fff'}
              message={tooltipMsg}
            />
          )}
        </ReOrderList>
      ) : null}
    </Container>
  );
};
const Container = styled.main`
  width: 100%;
  overflow: hidden;
`;

const GreetingArticle = styled.article`
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  margin-bottom: 30px;
`;
const TextBox = styled.div`
  > div > span {
    color: ${({ theme }) => theme.brandColor};
  }
`;
const IconBox = styled.div`
  display: flex;
  align-items: center;
`;

const PushArticle = styled.article`
  padding-left: 24px;
  margin-bottom: 50px;
  span {
    font-weight: bold;
  }
  .btnWraper {
    padding-right: 24px;
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

const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 96px;
  margin-bottom: 34px;
  background-color: ${({ theme }) => theme.greyScale3};
`;
export default QuickOrderPage;
