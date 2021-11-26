import React from 'react';
import styled, { css } from 'styled-components';
import { TextB2R } from '@components/Text';
import Button from '@components/Button';
import { homePadding, theme } from '@styles/theme';
import DefaultReview from '@components/Review/DefaultReview';

function DetailBottomReview({ reviews }: any) {
  const hasReivew = reviews.length > 0;
  return (
    <Container>
      <Wrapper hasReivew={hasReivew}>
        {hasReivew ? (
          <DefaultReview reviews={reviews} />
        ) : (
          <TextB2R color={theme.greyScale65} padding="0 0 16px 0">
            상품의 첫 번째 후기를 작성해주세요 :)
          </TextB2R>
        )}
        <Button
          backgroundColor={theme.white}
          color={theme.black}
          border
          borderRadius="8"
        >
          후기 작성하기 (최대 3,000포인트 적립)
        </Button>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 32px;
`;

const Wrapper = styled.div<{ hasReivew: boolean }>`
  ${homePadding}
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ hasReivew }) => {
    if (!hasReivew) {
      return css`
        justify-content: center;
        align-items: center;
        height: 50vh;
      `;
    }
  }}
`;

export default React.memo(DetailBottomReview);
