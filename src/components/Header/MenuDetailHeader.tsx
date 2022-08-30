import React from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import CartIcon from '@components/Header/Cart';
import ShareUrl from '@components/ShareUrl';

type TProps = {
  title?: string;
  isMobile?: boolean;
};

const MenuDetailHeader = ({ title }: TProps) => {
  const router = useRouter();
  const { isSpot } = router.query;

  const goBack = (): void => {
    if (isSpot) {
      router.back();
    } else if (router.query.returnPath) {
      router.push(router.query.returnPath as string);
    } else {
      router.back();
    }
  };

  const goToCart = () => {
    router.push('/cart');
    sessionStorage.removeItem('selectedDay');
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        <BtnWrapper>
          <ShareUrl className="share" title="상품 상세 페이지 링크" linkUrl={window.location.href}>
            <SVGIcon name="share" />
          </ShareUrl>
          <CartIcon onClick={goToCart} />
        </BtnWrapper>
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
  width: 100%;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin: 16px 24px; */
  .arrow {
    cursor: pointer;
    > svg {
    }
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  .share {
    padding-right: 27px;
    cursor: pointer;
  }
`;

export default React.memo(MenuDetailHeader);
