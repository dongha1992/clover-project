import React from 'react';
import styled from 'styled-components';
import { FlexCol, FlexRow, homePadding } from '@styles/theme';
import TextInput from '@components/TextInput';
import Button from '@components/Button';
import { TextH5B } from '@components/Text';
import { COUPON_LIST } from '@constants/menu';
import MypageCouponItem from '@components/CouponSheet/MypageCouponItem';

function coupon() {
  return (
    <Container>
      <Wrapper>
        <FlexRow padding="24px 0 0 0">
          <TextInput placeholder="쿠폰 코드를 입력해주세요." />
          <Button width="30%" margin="0 0 0 8px">
            등록하기
          </Button>
        </FlexRow>
        <FlexCol>
          <TextH5B padding="16px 0 24px 0"> 보유 쿠폰 4장</TextH5B>
          {COUPON_LIST.map((coupon, index) => (
            <MypageCouponItem coupon={coupon} key={index} />
          ))}
        </FlexCol>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;
const Wrapper = styled.div``;

export default coupon;
