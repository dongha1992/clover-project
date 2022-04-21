import React, { useEffect } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { SET_BOTTOM_SHEET, INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { commonSelector } from '@store/common';
import CartIcon from '@components/Header/Cart';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';

type TProps = {
  title?: string;
  isMobile?: boolean;
};

/* TODO: Header props으로 svg만 추가 */

const MenuDetailHeader = ({ title }: TProps) => {
  const dispatch = useDispatch();
  const { isMobile } = useSelector(commonSelector);

  const router = useRouter();

  useEffect(() => {
    return () => {
      dispatch(INIT_BOTTOM_SHEET());
    };
  }, []);

  const goBack = (): void => {
    router.back();
  };

  const goToShare = () => {
    if (isMobile) {
      if (navigator.share) {
        navigator
          .share({
            title: 'test',
            url: 'test',
          })
          .then(() => {
            alert('공유가 완료되었습니다.');
          })
          .catch(console.error);
      } else {
        return 'null';
      }
    } else {
      dispatch(INIT_BOTTOM_SHEET());
      dispatch(
        SET_BOTTOM_SHEET({
          content: <ShareSheet />,
        })
      );
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
          <div className="share" onClick={goToShare}>
            <SVGIcon name="share" />
          </div>
          <CartIcon onClick={goToCart} />
        </BtnWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: auto;
  left: calc(50%);
  background-color: white;
  z-index: 100000;
  height: 56px;

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
  }
`;

export default React.memo(MenuDetailHeader);
