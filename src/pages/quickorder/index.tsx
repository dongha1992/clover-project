import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { TextB2R, TextH2B, TextH3B } from '@components/Shared/Text';
import { ScrollHorizonList, theme } from '@styles/theme';
import { BASE_URL } from '@constants/mock';
import ReOrderList from '@components/Pages/QuickOrder/ReOrderList';
import OrderCardList from '@components/Pages/QuickOrder/OrderCardList';
import { Button } from '@components/Shared/Button';
import { HorizontalItem } from '@components/Item';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { userForm } from '@store/user';
import useQuickOrderList from '@hooks/useQuickOrder';
dayjs.locale('ko');

const QuickOrderPage = () => {
  const { isLoginSuccess, user } = useSelector(userForm);
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const weeks = new Date().getDay();

  /* 임시 */
  const [list] = useState([1]);
  // const noList: string | any[] = ['2022-01-23', '2022-01-24', '2022-01-25'];

  const [itemList, setItemList] = useState([]);
  const [night, setNight] = useState<Boolean>();
  const { cardList, timer, ment, tooltipTime } = useQuickOrderList();

  /* 목업 데이터 로직 */
  useEffect(() => {
    axios.get(`${BASE_URL}`).then(({ data }) => {
      setItemList(data);
    });
  }, []);
  /* 목업 데이터 로직 END */

  useEffect(() => {
    // setTime(Number(`${hours}.${format(minutes)}`));
    if (hours >= 6 && hours < 18) {
      setNight(false);
    } else {
      setNight(true);
    }
  }, [hours]);

  return (
    <Container data-cy="quickorder">
      <GreetingArticle>
        <TextBox>
          {isLoginSuccess ? (
            <TextH2B>
              <span>{user.name}</span>님{`\n`}
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

      <OrderCardList cardList={cardList} timer={timer} />

      <PushArticle>
        {!isLoginSuccess || list.length === 0 ? (
          <TextH3B padding="0 0 8px 0">신규 고객을 위한 아침</TextH3B>
        ) : (
          <TextH3B padding="0 0 18px 0">이전에 구매한 상품으로 또 먹을래요!</TextH3B>
        )}

        {(!isLoginSuccess || list.length === 0) && (
          <TextB2R color={theme.greyScale65} padding="0 0 18px 0">
            <span>새벽배송</span> 17시까지 주문 시 다음날 새벽 7시 전 도착
          </TextB2R>
        )}

        <ScrollHorizonList>
          <ScrollHorizonListGroup className="pushSHLG">
            {itemList.map((item, index) => (
              <HorizontalItem item={item} key={index} isQuick />
            ))}
          </ScrollHorizonListGroup>
        </ScrollHorizonList>

        {(!isLoginSuccess || list.length === 0) && (
          <div className="btnWraper">
            <Button margin="24px 0 0" border backgroundColor="#fff" color={theme.black}>
              전체 상품 첫 주문하기
            </Button>
          </div>
        )}
      </PushArticle>

      <Banner>신규서비스 소개</Banner>

      {(!isLoginSuccess || list.length !== 0) && <ReOrderList tooltipTime={tooltipTime} timer={timer} />}
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
