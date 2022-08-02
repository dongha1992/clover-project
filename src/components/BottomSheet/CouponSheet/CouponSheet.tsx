import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R, TextH6B, TextB2R } from '@components/Shared/Text';
import { theme, bottomSheetButton, fixedBottom } from '@styles/theme';
import CouponItem from './CouponItem';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { IPromotion } from '@model/index';
import { postPromotionCodeApi } from '@api/promotion';
import { useMutation, useQueryClient } from 'react-query';
import { SET_IS_LOADING } from '@store/common';
import { userForm } from '@store/user';

interface IProps {
  coupons?: IPromotion[];
}
const CouponSheet = ({ coupons }: IProps) => {
  const [couponList, setCouponList] = useState<IPromotion[]>(coupons!);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { me } = useSelector(userForm);

  let aleadyDownloadedCount = 0;

  const { mutateAsync: mutatePostPromotionCode } = useMutation(
    async (couponItem: IPromotion) => {
      const reqBody = {
        code: couponItem.code,
        reward: couponItem.reward,
      };

      const { data } = await postPromotionCodeApi(reqBody);
      if (data.code === 200) {
        return couponItem;
      }
    },
    {
      onSuccess: async (data) => {
        const updated = updateCouponHandler(data?.id!);
        setCouponList(updated);
        dispatch(
          SET_ALERT({
            alertMessage: '쿠폰을 다운받았습니다.',
          })
        );
        dispatch(SET_IS_LOADING(false));
      },
      onError: async (error: any) => {
        let alertMessage = '';
        if (error.code === 2202) {
          alertMessage = '이미 쿠폰을 다운받았습니다.';
        } else if (error.code === 1105) {
          alertMessage = '유효하지 않은 코드예요. 다시 한번 확인해 주세요.';
        } else {
          alertMessage = '알 수 없는 에러 입니다.';
        }
        dispatch(SET_IS_LOADING(false));
        return dispatch(
          SET_ALERT({
            alertMessage,
            submitBtnText: '확인',
          })
        );
      },
    }
  );

  useEffect(() => {}, []);

  const updateCouponHandler = (id: number) => {
    return couponList.map((item) => {
      if (item.id === id) {
        return { ...item, participationStatus: 'COMPLETED' };
      } else {
        return item;
      }
    });
  };

  const goToLogin = () => {
    return dispatch(
      SET_ALERT({
        alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
        submitBtnText: '확인',
        closeBtnText: '취소',
        onSubmit: () => router.push('/onboarding'),
      })
    );
  };

  const checkIsExpired = () => {};

  const downloadAllCoupon = async () => {
    if (!me) {
      goToLogin();
      return;
    }

    dispatch(SET_IS_LOADING(true));
    const available = couponList.filter((item) => item.participationStatus === 'POSSIBLE');
    if (available?.length! > 0) {
      for (let i = 0; i < available?.length!; i++) {
        const couponItem = coupons && available[i]!;

        const params = {
          code: couponItem?.code!,
          reward: couponItem?.reward!,
        };

        try {
          const { data } = await postPromotionCodeApi(params);
          if (data.code === 200) {
            aleadyDownloadedCount++;
            const updated = updateCouponHandler(couponItem?.id!);
            setCouponList(updated);
          }

          if (i + 1 === available?.length!) {
            if (aleadyDownloadedCount > 0) {
              dispatch(SET_ALERT({ alertMessage: '모든 쿠폰을 다운받았습니다.' }));
            } else {
              dispatch(SET_ALERT({ alertMessage: '다운 가능한 쿠폰이 없습니다.' }));
            }
          }
        } catch (error: any) {
          let alertMessage = '알 수 없는 에러 입니다.';
          if (error.code === 2202) {
            alertMessage = '이미 쿠폰을 다운받았습니다.';
          }
          dispatch(SET_ALERT({ alertMessage }));
        }
      }
    }

    dispatch(SET_IS_LOADING(false));
  };

  const downloadCouponHandler = async (coupon: IPromotion) => {
    if (!me) {
      goToLogin();
      return;
    }

    dispatch(SET_IS_LOADING(true));
    await mutatePostPromotionCode(coupon);
  };

  const closeHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <TextH5B center padding="16px 0 24px 0">
        쿠폰
      </TextH5B>
      <Wrapper>
        <InfoWrapper>
          <TextB3R color={theme.greyScale65}>{'마이페이지>쿠폰함으로 저장돼요!'}</TextB3R>
          <TextH6B textDecoration="underLine" color={theme.greyScale65} onClick={downloadAllCoupon} pointer>
            {couponList?.length! > 0 ? '전체 다운받기' : ''}
          </TextH6B>
        </InfoWrapper>
        <CouponListWrapper>
          {couponList?.length! > 0 ? (
            couponList?.map((coupon, index) => (
              <CouponItem coupon={coupon} key={index} onClick={downloadCouponHandler} />
            ))
          ) : (
            <TextB2R>다운로드 가능한 쿠폰이 없습니다.</TextB2R>
          )}
        </CouponListWrapper>
      </Wrapper>
      <ButtonContainer onClick={closeHandler}>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  ${fixedBottom};
  left: 0%;
`;

export default CouponSheet;
