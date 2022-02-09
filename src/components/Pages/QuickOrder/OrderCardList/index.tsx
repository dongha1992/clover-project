import { TextB3R, TextH4B, TextH6B } from '@components/Shared/Text';
import { cartForm } from '@store/cart';
import { ScrollHorizonList, theme } from '@styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import router from 'next/router';
import { SET_ORDER_TYPE } from '@store/order';
interface ICard {
  title: string;
  dec: string;
  timer?: boolean;
}
interface IProps {
  cardList: ICard[] | undefined;
  timer: string;
}

const OrderCardList = ({ cardList, timer }: IProps) => {
  const dispatch = useDispatch();
  const { cartLists } = useSelector(cartForm);

  const cardClick = (item: ICard) => {
    const { title } = item;
    dispatch(SET_ORDER_TYPE({ orderType: title.split(' ')[0] }));

    cartLists.length === 0 ? router.push(`/quickorder/category`) : router.push('/cart');
  };

  return (
    <CardList>
      <ScrollHorizonList>
        <ScrollHorizonListGroup>
          {cardList &&
            cardList.map((item: ICard, index: number) => (
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
