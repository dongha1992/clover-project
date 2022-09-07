import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { homePadding, theme } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { TextB2R, TextH4B } from '@components/Shared/Text';
import CardItem from '@components/Pages/Mypage/Card/CardItem';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import { getCardLists } from '@api/card';
import { IGetCard } from '@model/index';
import { show, hide } from '@store/loading';
import { useQuery } from 'react-query';
import isNil from 'lodash-es/isNil';
import { SET_CARD } from '@store/order';
import { useDispatch } from 'react-redux';
import { postOrderCardChangeApi } from '@api/order';

const CardManagementPage = () => {
  const {
    data: cards,
    isLoading,
    refetch,
  } = useQuery(
    'getCardList',
    async () => {
      dispatch(show());
      const { data } = await getCardLists();
      if (data.code === 200) {
        return data.data;
      }
    },
    {
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const dispatch = useDispatch();

  const { isOrder, orderId, isSubscription } = router.query;
  const isFromOrder = isOrder === 'true';
  const isFromSubscription = isSubscription === 'true';

  const cardEditHandler = async (card: IGetCard) => {
    // TODO(young) : 카드 api {code: 1120, message: 'not found order delivery'} 확인필요
    if (isOrder && orderId && isFromSubscription) {
      const cardId = card.id;
      let orderIdNumber = Number(orderId);
      const { data } = await postOrderCardChangeApi({ orderId: orderIdNumber, cardId });

      if (data.code === 200) {
        router.push(`/subscription/${orderId}`);
      }
    } else if (isFromOrder && isFromSubscription) {
      dispatch(SET_CARD(card.id));
      router.push({ pathname: '/order', query: { isSubscription } });
    } else if (isFromOrder) {
      dispatch(SET_CARD(card.id));
      router.push('/order');
    } else {
      router.push(`/mypage/card/edit/${card.id}?name=${card.name}&isMain=${card.main}`);
    }
  };

  const goToCardRegister = (): void => {
    if (isOrder && orderId && isFromSubscription) {
      router.push({ pathname: '/mypage/card/register', query: { isOrder: isFromOrder, orderId, isSubscription } });
    } else if (isOrder && isFromSubscription) {
      router.push({ pathname: '/mypage/card/register', query: { isOrder: isFromOrder, isSubscription } });
    } else {
      router.push({ pathname: '/mypage/card/register', query: { isOrder: isFromOrder } });
    }
  };

  if (isLoading || isNil(cards)) {
    return <div></div>;
  }

  return (
    <Container>
      {!cards?.length ? (
        <EmptyWrapper>
          <SVGIcon name="emptyCard" />
          <TextB2R color={theme.greyScale65} padding="16px 0 32px 0">
            아직 등록된 카드가 없어요 😭
          </TextB2R>
          <Button backgroundColor={theme.white} color={theme.black} border onClick={goToCardRegister}>
            카드 등록하기
          </Button>
        </EmptyWrapper>
      ) : (
        <Wrapper>
          <TextH4B padding="24px 0">카드 관리</TextH4B>
          {cards.map((card: IGetCard, index: number) => (
            <div key={index}>
              <CardItem onClick={cardEditHandler} card={card} isFromOrder={isFromOrder} isMypage />
              {cards.length !== index - 1 && <BorderLine height={1} margin="0 0 24px 0" />}
            </div>
          ))}
          <Button backgroundColor={theme.white} color={theme.black} border onClick={goToCardRegister}>
            카드 등록하기
          </Button>
        </Wrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;

const Wrapper = styled.div``;
const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export default CardManagementPage;
