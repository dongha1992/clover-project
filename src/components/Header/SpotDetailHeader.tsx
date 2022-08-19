import React, { useEffect } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import CartIcon from '@components/Header/Cart';
import ShareUrl from '@components/ShareUrl';

type TProps = {
  title?: string;
  isMobile?: boolean;
};

/* TODO: Header props으로 svg만 추가 */

const SpotDetailHeader = ({ title }: TProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { q_share } = router.query;
  const currentUrl = window.location.href;
  const spotLink = `${currentUrl}&q_share=true`;

  useEffect(() => {
    return () => {
      dispatch(INIT_BOTTOM_SHEET());
    };
  });

  const goBack = (): void => {
    if (q_share) {
      router.push('/spot');
    } else {
      router.back();
    }
  };

  const goToCart = () => {
    router.push('/cart');
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        <BtnWrapper>
          <ShareUrl className="share" title="프코스팟 상세 페이지 링크" linkUrl={spotLink}>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 24px;
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

export default React.memo(SpotDetailHeader);
