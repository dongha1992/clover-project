import React, { useEffect } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';

type TProps = {
  title?: string;
};

const DefaultHeader = ({ title }: TProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { menuItem } = useSelector(menuSelector);

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
    } else if (router.pathname === '/order/finish') {
      router.replace('/');
    } else if (router.pathname === '/login') {
      router.replace('/onboarding');
    } else {
      router.back();
    }
  };

  const oauth = router.pathname === '/oauth';
  const totalReview = router.pathname === '/menu/[menuId]/review/total';
  return (
    <Container>
      <Wrapper>
        {!oauth && (
          <div className="arrow" onClick={goBack}>
            <SVGIcon name="arrowLeft" />
          </div>
        )}
        <TextH4B padding="2px 0 0 0">{totalReview ? `${title} (${menuItem.reviewCount})` : title}</TextH4B>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: ${breakpoints.mobile}px;
  position: absolute;
  top: 0;
  background-color: white;

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
