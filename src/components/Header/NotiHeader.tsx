import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useRouter } from 'next/router';
import { TextH4B } from '@components/Shared/Text';

const MyPageHeader = () => {
  const router = useRouter();

  const goBack = (): void => {
    router.back();
  };

  const goToSetting = () => {
    router.push('/mypage/setting');
  };

  return (
    <Container>
      <Wrapper>
        <Left onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </Left>
        <TextH4B padding="2px 0 0 0">알림</TextH4B>
        <Right onClick={goToSetting}>
          <SVGIcon name="setting" />
        </Right>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default MyPageHeader;
