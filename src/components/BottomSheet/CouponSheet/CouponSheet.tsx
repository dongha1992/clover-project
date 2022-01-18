import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { theme, bottomSheetButton } from '@styles/theme';
import { COUPON_LIST } from '@constants/menu';
import CouponItem from './CouponItem';
import { setAlert } from '@store/alert';
import { useDispatch } from 'react-redux';
import router from 'next/router';
import { Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';

const isLogin = false;

const CouponSheet = () => {
  const dispatch = useDispatch();

  const downloadAllCoupon = () => {
    dispatch(
      setAlert({
        alertMessage: '모든 쿠폰을 다운받았습니다.',
      })
    );
  };

  const downloadCouponHandler = () => {
    if (isLogin) {
      dispatch(
        setAlert({
          alertMessage: '쿠폰을 다운받았습니다.',
        })
      );
    } else {
      dispatch(
        setAlert({
          alertMessage: '로그인 후 쿠폰 다운로드 가능합니다.',
          submitBtnText: '로그인 하기',
          closeBtnText: '취소',
          onSubmit: () => router.push('/login'),
        })
      );
    }
  };

  const submitHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

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
          <TextH6B
            textDecoration="underLine"
            color={theme.greyScale65}
            onClick={downloadAllCoupon}
          >
            전체 다운받기
          </TextH6B>
        </InfoWrapper>
        <CouponListWrapper>
          {COUPON_LIST.map((coupon, index) => (
            <CouponItem
              coupon={coupon}
              key={index}
              onClick={downloadCouponHandler}
            />
          ))}
        </CouponListWrapper>
      </Wrapper>
      <ButtonContainer onClick={submitHandler}>
        <Button height="100%" width="100%" borderRadius="0">
          확인
        </Button>
      </ButtonContainer>
    </Container>
  );
};
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

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default CouponSheet;
