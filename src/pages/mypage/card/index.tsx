import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { homePadding, theme } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { TextB2R, TextH4B } from '@components/Shared/Text';
import CardItem from '@components/Pages/Mypage/Card/CardItem';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import { getCardLists } from '@api/card';
import { ICard } from '@components/Pages/Mypage/Card/CardItem';

const CardManagementPage = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getCards();
  }, []);

  const getCards = async () => {
    try {
      const { data } = await getCardLists();
      if (data.code === 200) {
        setCards(data.data);
      }
    } catch (error) {}
  };

  const cardEditHandler = (card: ICard) => {
    router.push(`/mypage/card/edit/${card.id}?name=${card.name}`);
  };

  const goToCardRegister = (): void => {
    router.push('/mypage/card/register');
  };

  return (
    <Container>
      {!cards.length ? (
        <EmptyWrapper>
          <SVGIcon name="emptyCard" />
          <TextB2R color={theme.greyScale65} padding="16px 0 32px 0">
            아직 등록된 카드가 없어요 😭
          </TextB2R>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            onClick={goToCardRegister}
          >
            카드 등록하기
          </Button>
        </EmptyWrapper>
      ) : (
        <Wrapper>
          <TextH4B padding="24px 0">카드 관리</TextH4B>
          {cards.map((card, index) => (
            <div key={index}>
              <CardItem onClick={cardEditHandler} card={card} />
              {cards.length !== index - 1 && (
                <BorderLine height={1} margin="0 0 24px 0" />
              )}
            </div>
          ))}
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            onClick={goToCardRegister}
          >
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
