import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { COUPON_LIST } from '@constants/menu';
import CouponItem from './CouponItem';

function CouponSheet() {
  return (
    <Container>
      <TextH5B center padding="16px 0 24px 0">
        쿠폰
      </TextH5B>
      <Wrapper>
        <InfoWrapper>
          <TextB3R color={theme.greyScale65}>
            {'마이페이지>쿠폰함으로 저장돼요!'}
          </TextB3R>
          <TextH6B textDecoration="underLine" color={theme.greyScale65}>
            전체 다운받기
          </TextH6B>
        </InfoWrapper>
        <CouponListWrapper>
          {COUPON_LIST.map((coupon, index) => (
            <CouponItem coupon={coupon} key={index} />
          ))}
        </CouponListWrapper>
      </Wrapper>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Wrapper = styled.div`
  padding: 0px 24px;
  height: 400px;
  overflow-y: scroll;
`;

const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CouponListWrapper = styled.div`
  overflow-y: scroll;
`;

export default CouponSheet;
