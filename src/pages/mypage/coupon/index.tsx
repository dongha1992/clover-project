import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { fixedBottom, FlexCol, FlexRow, homePadding, flexCenter, theme } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import { TextB2R, TextH5B } from '@components/Shared/Text';
import { MypageCouponItem } from '@components/BottomSheet/CouponSheet';
import { useRouter } from 'next/router';
import { SET_USER_SELECT_COUPON } from '@store/coupon';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { postPromotionCodeApi } from '@api/promotion';
import { getCouponApi } from '@api/coupon';
import { ICoupon } from '@model/index';
import { SET_ALERT } from '@store/alert';

const CouponManagementPage = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon>();

  const codeRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutateAsync: mutatePostPromotionCode } = useMutation(
    async () => {
      if (codeRef.current) {
        const reqBody = {
          code: codeRef?.current?.value,
          reward: 'COUPON',
        };

        const { data } = await postPromotionCodeApi(reqBody);

        let alertMessage = '';
        if (data.code === 2002) {
          alertMessage = '이미 등록한 쿠폰입니다.';
        } else if (data.code === 1105) {
          alertMessage = '존재하지 않는 쿠폰번호입니다.';
        } else {
          alertMessage = '쿠폰이 등록되었습니다.';
        }
        return dispatch(
          SET_ALERT({
            alertMessage,
            submitBtnText: '확인',
          })
        );
      }
    },
    {
      onSuccess: async (data) => {
        console.log(data, 'asdasd');
        /* TODO: 성공 혹 실패시 작업 */
      },
      onError: async (data) => {},
    }
  );

  const {
    data: coupons,
    isLoading,
    refetch,
  } = useQuery(
    'getCouponList',
    async () => {
      const { data } = await getCouponApi();
      return data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const selectCouponHandler = (coupon: ICoupon): void => {
    setSelectedCoupon(coupon);
  };

  if (isLoading) {
    return <div>로딩중</div>;
  }

  if (coupons?.length! < 0) {
    return (
      <>
        <FlexRow padding="24px 0 0 0">
          <TextInput placeholder="쿠폰 코드를 입력해주세요." ref={codeRef} />
          <Button width="30%" margin="0 0 0 8px">
            등록하기
          </Button>
        </FlexRow>
        <EmptyContainer>
          <TextB2R color={theme.greyScale65}>보유한 쿠폰이 없어요 😭</TextB2R>
        </EmptyContainer>
      </>
    );
  } else {
    return (
      <Container>
        <Wrapper>
          <FlexRow padding="24px 0 0 0">
            <TextInput placeholder="쿠폰 코드를 입력해주세요." ref={codeRef} />
            <Button width="30%" margin="0 0 0 8px" onClick={() => mutatePostPromotionCode()}>
              등록하기
            </Button>
          </FlexRow>
          <FlexCol>
            <TextH5B padding="16px 0 24px 0"> 보유 쿠폰 {coupons?.length}장</TextH5B>
            {coupons?.map((coupon: ICoupon, index: number) => (
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
  }
};

const Container = styled.div`
  ${homePadding}
`;

const Wrapper = styled.div``;

const EmptyContainer = styled.div`
  height: 80vh;
  width: 100%;
  ${flexCenter}
  display: flex;
  flex-direction: column;
`;
export default CouponManagementPage;
