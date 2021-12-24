import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { TextB3R, TextH2B, TextH3B, TextH4B } from '@components/Shared/Text';
import { ScrollHorizonList } from '@styles/theme';
import { userForm } from '@store/user';
import { useSelector } from 'react-redux';
import Item from '@components/Item';

import { BASE_URL } from '@constants/mock';
import ReOrderList from '@components/Pages/QuickOrder/ReOrderList';
import OrderCardList from '@components/Pages/QuickOrder/OrderCardList';
import { MENT } from '@constants/quick';
const QuickOrderPage: React.FC = () => {
  const day = new Date();
  const hours = day.getHours();
  const minutes = day.getMinutes();
  const seconds = day.getSeconds();
  const weeks = day.getDay();

  /* 임시 */
  const [user] = useState(true);
  const [list] = useState([]);

  const [itemList, setItemList] = useState([]);
  const [night, setNight] = useState<Boolean>();
  const [time, setTime] = useState<number>(Number(`${hours}.${minutes}`));
  const [pushStatus, setPushStatus] = useState('');
  const [ment, setMent] = useState('');

  /* 목업 데이터 로직 */
  useEffect(() => {
    axios.get(`${BASE_URL}`).then(({ data }) => {
      setItemList(data);
    });
  }, []);
  /* 목업 데이터 로직 END */

  useEffect(() => {
    setTime(Number(`${hours}.${minutes}`));

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
        minutes={minutes}
        seconds={seconds}
        weeks={weeks}
        pushStatus={pushStatus}
      />

      <PushArticle>
        <TextH3B padding="0 0 24px 0">
          이전에 구매한 상품으로 또 먹을래요!
        </TextH3B>
        <ScrollHorizonList>
          <ScrollHorizonListGroup className="pushSHLG">
            {itemList.map((item, index) => (
              <Item item={item} key={index} isCart={true} isQuick={true} />
            ))}
          </ScrollHorizonListGroup>
        </ScrollHorizonList>
      </PushArticle>

      <Banner>신규서비스 소개</Banner>

      <ReOrderList />
    </Container>
  );
};
const Container = styled.main`
  width: 100%;
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
  width: 100%;
  height: 96px;
  margin-bottom: 34px;
  background-color: ${({ theme }) => theme.greyScale3};
`;
export default QuickOrderPage;
