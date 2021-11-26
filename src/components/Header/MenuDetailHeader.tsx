import React from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B } from '@components/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/getMediaQuery';

type TProps = {
  title?: string;
};

/* TODO: Header props으로 svg만 추가 */

function MenuDetailHeader({ title }: TProps) {
  console.log(title);
  const router = useRouter();

  const goBack = (): void => {
    router.back();
  };

  const goToShare = () => {};
  const goToCart = () => {};

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
          <div className="cart" onClick={goToCart}>
            <SVGIcon name="cart" />
          </div>
        </BtnWrapper>
      </Wrapper>
    </Container>
  );
}

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
  padding: 14px 27px;
  .arrow {
    cursor: pointer;
    > svg {
    }
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  .cart {
    padding-left: 24px;
  }
`;

export default React.memo(MenuDetailHeader);
