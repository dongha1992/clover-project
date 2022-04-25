import React, { useEffect } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';

interface IProps {
  title?: string;
}

const SpotSearchHeader = ({ title }: IProps) => {
  const router = useRouter();

  const goBack = (): void => {
    router.back();
  };

  const goToMap = () => {
    router.push('/spot/search/location');
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        {router.pathname === '/spot/search' ? (
          <BtnWrapper>
            <div className="map" onClick={goToMap}>
              <SVGIcon name="map" />
            </div>
          </BtnWrapper>
        ) : (
          <BtnWrapper>
            <div className="threeLines" onClick={goToMap}>
              <SVGIcon name="threeLines" />
            </div>
          </BtnWrapper>
        )}
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
  z-index: 900;
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
  cursor: pointer;
`;

export default React.memo(SpotSearchHeader);
