import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { COUPON_LIST } from '@constants/menu';
import CouponItem from './CouponItem';
import { setAlert } from '@store/alert';
import { useDispatch } from 'react-redux';
import router from 'next/router';

const isLogin = false;

function CouponSheet() {
  const dispatach = useDispatch();

  const downloadAllCoupon = () => {
    dispatach(
      setAlert({
        alertMessage: '모든 쿠폰을 다운받았습니다.',
      })
    );
  };

  const downloadCouponHandler = () => {
    if (isLogin) {
      dispatach(
        setAlert({
          alertMessage: '쿠폰을 다운받았습니다.',
        })
      );
    } else {
      dispatach(
        setAlert({
          alertMessage: '로그인 후 쿠폰 다운로드 가능합니다.',
          submitBtnText: '로그인 하기',
          closeBtnText: '취소',
          onSubmit: () => router.push('/login'),
        })
      );
    }
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
