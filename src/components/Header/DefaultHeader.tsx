import React from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';
import { Obj } from '@model/index';
import { useHistory } from '@context/History';

type TProps = {
  title?: string;
};

const DefaultHeader = ({ title }: TProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { history } = useHistory();

  const { isSubscription, menuId, returnPath, isOrder, tab, isSpot } = router.query;
  const { menuItem, reviewImagesCount } = useSelector(menuSelector);

  const spotForm = router.pathname === '/spot/join/main/form';
  const loginPage = router.pathname === '/login';
  const oauth = router.pathname === '/oauth';
  const totalReview = router.pathname === '/menu/[menuId]/review/total';
  const totalPhotoReview = router.pathname === '/menu/[menuId]/review/photo';
  const reviewDetail = router.pathname === '/menu/[menuId]/review/[contentId]';
  const finishOrder = router.pathname === '/order/finish';
  const orderDetail = router.pathname === '/mypage/order-detail/[id]';
  const subsCancel = router.pathname === '/subscription/[detailId]/cancel/complete';
  const subsDetail = router.pathname === '/subscription/[detailId]';
  const subsSubCancel = router.pathname === '/subscription/[detailId]/sub-cancel/complete';
  const subsInfo = router.pathname === '/subscription/set-info';
  const addressEdit = router.pathname === '/mypage/address/edit/[id]';
  const reviewEdit = router.pathname === '/mypage/review/completed/edit/[reviewId]';
  const cardEdit = router.pathname === '/mypage/card';
  const reviewSchedulePage = router.pathname === '/mypage/review/schedule';
  const reviewCompletedPage = router.pathname === '/mypage/review/completed';
  const addressPickupPage = router.pathname === '/mypage/address/pickup';
  const addressDeliveryPage = router.pathname === '/mypage/address/delivery';
  const cartDelivery = router.pathname === '/cart/delivery-info';
  const destinationSearch = router.pathname === '/destination/search';
  const cart = router.pathname === '/cart';

  const countMap: Obj = {
    '/menu/[menuId]/review/total': menuItem?.reviewCount ?? 0,
    '/menu/[menuId]/review/photo': reviewImagesCount ?? 0,
  };

  const goBack = (): void => {
    if (spotForm) {
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
    } else if (loginPage) {
      router.replace('/onboarding');
    } else if (subsDetail) {
      returnPath ? router.replace('/subscription') : router.back();
    } else if (orderDetail) {
      if (router.query.isFinish) {
        router.replace('/');
      } else {
        router.back();
      }
    } else if (addressEdit) {
      router.replace({
        pathname: router.query.spotPickupId ? '/mypage/address/pickup' : '/mypage/address/delivery',
        query: { isSpot: router.query.spotPickupId ? 'true' : 'false' },
      });
    } else if (reviewEdit) {
      router.replace({ pathname: '/mypage/review/completed' });
    } else if (cardEdit) {
      isOrder ? router.back() : router.push({ pathname: '/mypage' });
    } else if (addressPickupPage || addressDeliveryPage) {
      isSpot ? router.replace({ pathname: '/mypage' }) : router.back();
    } else if (cart) {
      sessionStorage.removeItem('checkedMenus');
      sessionStorage.removeItem('selectedDay');
      router.back();
    } else if (totalReview || totalPhotoReview || reviewSchedulePage || reviewCompletedPage || reviewDetail) {
      tab === 'review' ? router.replace({ pathname: `/menu/${router.query.menuId}`, query: { tab } }) : router.back();
    } else {
      router.back();
    }
  };

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
  width: 100%;
  height: 100%;
  padding: 0 24px;
  /* padding: 16px 24px; */
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
