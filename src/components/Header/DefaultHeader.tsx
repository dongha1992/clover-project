import React, { useEffect, useState } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';
import { useQuery, useQueryClient } from 'react-query';
import { Obj } from '@model/index';

type TProps = {
  title?: string;
};

const DefaultHeader = ({ title }: TProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isSubscription, menuId, returnPath } = router.query;
  const { menuItem, reviewImagesCount } = useSelector(menuSelector);
  const { reviewCount } = menuItem;

  const oauth = router.pathname === '/oauth';
  const totalReview = router.pathname === '/menu/[menuId]/review/total';
  const totalPhotoReview = router.pathname === '/menu/[menuId]/review/photo';
  const finishOrder = router.pathname === '/order/finish';
  const orderDetail = router.pathname === '/mypage/order-detail/[id]';
  const subsCancel = router.pathname === '/subscription/[detailId]/cancel/complete';
  const subsSubCancel = router.pathname === '/subscription/[detailId]/sub-cancel/complete';

  const countMap: Obj = {
    '/menu/[menuId]/review/total': reviewCount,
    '/menu/[menuId]/review/photo': reviewImagesCount,
  };

  const goBack = (): void => {
    if (router.pathname === '/spot/join/main/form') {
      dispatch(
        SET_ALERT({
          alertMessage: `입력한 내용은 저장되지 않아요.\n신청을 취소하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => {
            router.back();
          },
        })
      );
    } else if (router.pathname === '/login') {
      router.replace('/onboarding');
    } else if (router.pathname === '/cart/delivery-info') {
      if (!isSubscription) {
        router.replace('/cart');
      } else {
        router.replace({ pathname: '/subscription/set-info', query: router.query });
      }
    } else if (router.pathname === '/subscription/set-info') {
      // router.replace(`/menu/${menuId}`);
      router.back();
    } else if (router.pathname === '/subscription/[detailId]') {
      returnPath ? router.replace('/subscription') : router.back();
    } else if (orderDetail) {
      if (router.query.isFinish) {
        router.replace('/');
      } else {
        router.back();
      }
    } else {
      router.back();
    }
  };

  if (totalReview && !reviewCount) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Wrapper>
        {!oauth && !finishOrder && !subsCancel && !subsSubCancel && (
          <div className="arrow" onClick={goBack}>
            <SVGIcon name="arrowLeft" />
          </div>
        )}
        <TextH4B padding="2px 0 0 0">
          {totalReview || totalPhotoReview ? `${title} (${countMap[router.pathname]})` : title}
        </TextH4B>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: ${breakpoints.mobile}px;
  position: relative;
  top: 0;
  background-color: #fff;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  .arrow {
    cursor: pointer;
    > svg {
      position: absolute;
      left: 24px;
      bottom: 16px;
    }
  }
`;

export default DefaultHeader;
