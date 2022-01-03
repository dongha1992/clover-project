import React from 'react';
import styled from 'styled-components';
import { MypageMenu } from '../index';

const TermPage = () => {
  return (
    <Container>
      <Wrapper>
        <MypageMenu title="이용 약관" link="/mypage/term/use" />
        <MypageMenu title="개인정보 처리방침" link="/mypage/term/privacy" />
        <MypageMenu
          title="위치정보 서비스 이용 약관"
          link="/mypage/term/location"
          hideBorder
        />
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  padding-top: 24px;
`;

export default TermPage;
