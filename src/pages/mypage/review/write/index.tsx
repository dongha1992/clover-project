import React, { useState } from 'react';
import styled from 'styled-components';
import ReviewInfo from '@components/Pages/mypage/review/ReviewInfo';
import { homePadding } from '@styles/theme';

function writeReview() {
  const [isShow, setIsShow] = useState(false);
  return (
    <Container>
      <Wrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

export default writeReview;
