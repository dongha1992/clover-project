import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { fixedBottom, FlexBetween, FlexCol, FlexRow, homePadding } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import { TextH4B, TextH5B } from '@components/Shared/Text';
import { MypageCouponItem } from '@components/BottomSheet/CouponSheet';
import { useRouter } from 'next/router';
import { SET_USER_SELECT_COUPON } from '@store/coupon';
import { useDispatch } from 'react-redux';
import { ICoupon } from '@model/index';
import { useMutation, useQueryClient } from 'react-query';
import { SVGIcon } from '@utils/common';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';

interface IProps {
  coupons: ICoupon[];
}
const OrderCouponSheet = ({ coupons }: IProps) => {
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon>();
  const router = useRouter();

  const promotionCodeRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const goToOrder = () => {
    dispatch(SET_USER_SELECT_COUPON(selectedCoupon!));
    router.back();
  };

  const selectCouponHandler = (coupon: ICoupon): void => {
    setSelectedCoupon(coupon);
  };

  const registerPromotionCode = () => {};

  const closeBottomSheet = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

  const isDisabled = selectedCoupon !== undefined;

  return (
    <Container>
      <Wrapper>
        <FlexBetween margin="26px 0">
          <div />
          <TextH4B>쿠폰</TextH4B>
          <div onClick={closeBottomSheet}>
            <SVGIcon name="defaultCancel" width="24" height="24" />
          </div>
        </FlexBetween>
        <FlexRow padding="24px 0 0 0">
          <TextInput placeholder="쿠폰 코드를 입력해주세요." ref={promotionCodeRef} />
          <Button width="30%" margin="0 0 0 8px" onClick={registerPromotionCode}>
            등록하기
          </Button>
        </FlexRow>
        <FlexCol>
          <TextH5B padding="16px 0 24px 0"> 보유 쿠폰 {coupons.length}장</TextH5B>
          {coupons?.map((coupon: ICoupon, index: number) => (
            <MypageCouponItem
              coupon={coupon}
              key={index}
              selectCouponHandler={selectCouponHandler}
              isSelected={selectedCoupon?.id === coupon.id}
            />
          ))}
        </FlexCol>
        <ButtonWrapper onClick={goToOrder}>
          <Button height="100%" width="100%" borderRadius="0" disabled={!isDisabled}>
            적용하기
          </Button>
        </ButtonWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
  height: 92vh;
`;

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

export default OrderCouponSheet;