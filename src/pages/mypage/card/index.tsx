import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { FlexCenter, homePadding, theme } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { TextB2R, TextH4B } from '@components/Shared/Text';
import CardItem from '@components/Pages/Mypage/Card/CardItem';
import Button from '@components/Shared/Button';
import router from 'next/router';

const CardManagementPage = () => {
  const CARDS = [1, 2] as any[];

  const cardHandler = () => {};

  const goToCardRegister = (): void => {
    router.push('/mypage/card/register');
  };

  return (
    <Container>
      {!CARDS.length ? (
        <EmptyWrapper>
          <SVGIcon name="emptyCard" />
          <TextB2R color={theme.greyScale65} padding="0 0 32px 0">
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
          {CARDS &&
            CARDS.map((card, index) => (
              <div key={index}>
                <CardItem onClick={cardHandler} />
                {CARDS.length !== index - 1 && (
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
