import React, { useState } from 'react';
import styled from 'styled-components';
import { fixedBottom, FlexCol, FlexRow, homePadding } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import { TextH5B } from '@components/Shared/Text';
import { COUPON_LIST } from '@constants/menu';
import { MypageCouponItem } from '@components/BottomSheet/CouponSheet';
import { useRouter } from 'next/router';
import { SET_USER_SELECT_COUPON } from '@store/coupon';
import { useDispatch } from 'react-redux';

export interface ICoupon {
  id: number;
  discount: number;
  name: string;
  condition?: string;
  expireDate: string[];
  type: string;
  isDownload: boolean;
  canUseMenu: string[];
  deliveryMethod?: string;
}

const CouponManagementPage = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon>();
  const router = useRouter();

  const selectCouponHandler = (coupon: ICoupon): void => {
    setSelectedCoupon(coupon);
  };

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
            <MypageCouponItem
              coupon={coupon}
              key={index}
              selectCouponHandler={selectCouponHandler}
              isSelected={selectedCoupon?.id === coupon.id}
            />
          ))}
        </FlexCol>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

export default CouponManagementPage;
