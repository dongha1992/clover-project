import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import { TimerTooltip } from '@components/Shared/Tooltip';
import router from 'next/router';

const SbsBottom = () => {
  const [tempIsLike, setTempIsLike] = useState<boolean>(false);

  const goToDib = useCallback(() => {
    setTempIsLike((prev) => !prev);
  }, []);

  const clickButtonHandler = () => {
    router.push('/subscription/set-info');
  };

  return (
    <Container>
      <Wrapper>
        <LikeWrapper>
          <LikeBtn onClick={goToDib}>
            <SVGIcon name={tempIsLike ? 'likeRed' : 'likeBlack'} />
          </LikeBtn>
          <TextH5B color={theme.white} padding="3px 0 0 4px">
            0
          </TextH5B>
        </LikeWrapper>
        <Col />
        <BtnWrapper onClick={clickButtonHandler}>
          <TextH5B color={theme.white}>구독하기</TextH5B>
          <TootipWrapper>
            <TimerTooltip message={'최대 9% 할인'} bgColor={theme.brandColor} color={theme.white} minWidth="0" />
          </TootipWrapper>
        </BtnWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.section`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  left: calc(50%);
  background-color: ${({ theme }) => theme.black};

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const Wrapper = styled.div`
  padding: 0 24px;
  height: 56px;
  align-items: center;
  display: flex;
  width: 100%;
`;

const TootipWrapper = styled.article`
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%);
  > div {
    position: relative;
    left: auto;
    top: auto;
  }
`;

const LikeWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
`;

const Col = styled.div`
  width: 1px;
  height: 24px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${({ theme }) => theme.white};
`;

const BtnWrapper = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  cursor: pointer;
`;

const LikeBtn = styled.div`
  display: flex;
  cursor: pointer;
`;

export default SbsBottom;
