import React from 'react';
import styled, { css } from 'styled-components';
import { theme, fixedBottom } from '@styles/theme';
import { TextH2B, TextB3R, TextH5B } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';

// 프라이빗 트라이얼 링크 페이지 
const PrivateOpenPage = () => {
  const router = useRouter();
  const { trialId } = router.query;

  const goToSpotStatusDetail = () => {
    router.replace({
      pathname: `/mypage/spot-status/detail/${trialId}`,
      query: {
        q_share: true,
      }
    })
  };
  
  return (
    <Container>
      <HeaderContentWrapper>
        <TextH2B>{`프코스팟\n함께 정식 오픈하고\n3,000P 받으세요`}</TextH2B>
        <TextB3R color={theme.greyScale65}>{`트라이얼(2주) 기간 동안 해당 프코스팟으로\n5명이 주문해야 정식 오픈 할 수 있어요!`}</TextB3R>
      </HeaderContentWrapper>
      <OpenImgWrapper/>
      <FooterContentWrapper>
        <TextH5B color={theme.greyScale65}>프코스팟이란?</TextH5B>
        <Col />
        <TextB3R color={theme.greyScale65}>1개만 주문해도 언제나 무료배송되는 프레시코드만의 프리미엄 점심 배송서비스. 당일 아침 9시 30분 이전까지 프코스팟으로 결제 시, 점심시간에 맞춰 지정 픽업 장소로 배송돼요!</TextB3R>
      </FooterContentWrapper>
      <FixedButton onClick={goToSpotStatusDetail}>
        <Button
          borderRadius="0"
          height="100%"
          padding="10px 0 0 0"
          backgroundColor={theme.balck}
        >
          함께 오픈하고 혜택받기
        </Button>
      </FixedButton>
    </Container>
  );
};

const Container = styled.div``;

const HeaderContentWrapper = styled.div`
  padding: 24px 24px 48px 24px;
`;

const OpenImgWrapper = styled.div`
  width: 100%;
  height: 235px;
  background: ${theme.greyScale25};
`;

const FooterContentWrapper = styled.div`
  padding: 24px;
  background: ${theme.greyScale3};
`;

const Col = styled.div`
  width: 100%;
  border-top: 1px solid ${theme.greyScale6};
  margin: 16px 0;
`;

const FixedButton = styled.section`
  ${fixedBottom}
`;

export default PrivateOpenPage;
