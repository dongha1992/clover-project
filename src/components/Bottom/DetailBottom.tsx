import React, { useState } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { TextH5B } from '@components/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';

/*TODO: Like 리덕스로 받아서 like + 시 api 콜 */

function DetailBottom() {
  const [tempIsLike, setTempIsLike] = useState<boolean>(false);
  const numOfLike = 10;

  const goToDib = () => {
    setTempIsLike((prev) => !prev);
  };
  return (
    <Container>
      <Wrapper>
        <LikeWrapper>
          <LikeBtn onClick={goToDib}>
            <SVGIcon name={tempIsLike ? 'likeRed' : 'likeBlack'} />
          </LikeBtn>
          <TextH5B color={theme.white} padding="0 0 0 4px">
            {tempIsLike ? numOfLike + 1 : numOfLike}
          </TextH5B>
        </LikeWrapper>
        <Col />
        <BtnWrapper>
          <TextH5B color={theme.white}>
            5시까지 주문하면 내일 새벽 7시전 도착
          </TextH5B>
        </BtnWrapper>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  height: 56px;
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
  padding: 16px 24px;
  display: flex;
  width: 100%;
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
  width: 100%;
  text-align: center;
`;

const LikeBtn = styled.div``;

export default DetailBottom;