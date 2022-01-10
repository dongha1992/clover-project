import React, { useEffect } from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/getMediaQuery';

interface IProps {
  title?: string;
};

const CloseDefaultHeader = ({ title }: IProps) => {
  const router = useRouter();

  const goHome = (): void => {
    router.push('/home');
  };

  return (
    <Container>
      <Wrapper>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        <div className="close" onClick={goHome}>
          <SVGIcon name="crossCloseBlack" />
        </div>
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
  height: 56px;
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
  justify-content: center;
  padding: 16px 24px;
  .close {
    cursor: pointer;
    > svg {
      position: absolute;
      right: 24px;
      bottom: 16px;
    }
  }
`;

export default CloseDefaultHeader;