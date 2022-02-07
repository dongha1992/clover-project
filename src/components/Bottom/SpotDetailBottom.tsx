import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import { useToast } from '@hooks/useToast';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { TimerTooltip } from '@components/Shared/Tooltip';

/*TODO: 재입고 알림등 리덕스에서 메뉴 정보 가져와야 함s*/
const SpotDetailBottom = () => {
  const [tempIsLike, setTempIsLike] = useState<boolean>(false);
  const [isFirstToastRender, setIsFirstToastRender] = useState<boolean>(true);
  const { showToast, hideToast } = useToast();
  const { spotDetail } = useSelector(spotSelector);

  const goToDib = useCallback(() => {
    setTempIsLike((prev) => !prev);
  }, [tempIsLike]);

  useEffect(() => {
    setIsFirstToastRender(false);
  }, []);

  useEffect(() => {
    /* TODO : 렌더 시 처음에 alert 뜨는 거 */
    if (isFirstToastRender) return;
    /* TODO: 빠르게 눌렀을 때 toast 메시지 엉킴 */
    const message =
      tempIsLike === true ? '스팟을 찜 했어요!' : '스팟을 찜 해제 했어요!';
    showToast({ message });

    return () => hideToast();
  }, [goToDib]);


  const goToCart = (e: any): void => {
    e.stopPropagation();
    router.push('/cart');
  };

  return (
    <Container>
      <Wrapper>
        <LikeWrapper>
          <LikeBtn onClick={goToDib}>
            <SVGIcon name={spotDetail.liked ? 'likeRed' : 'likeBlack'} />
          </LikeBtn>
          <TextH5B color={theme.white} padding="0 0 0 4px">
            {spotDetail.likeCount}
          </TextH5B>
        </LikeWrapper>
        <Col />
        <BtnWrapper onClick={goToCart}>
          <TextH5B color={theme.white}>
              주문하기
          </TextH5B>
        </BtnWrapper>
      </Wrapper>
      {
        spotDetail.discountRate !== 0 && (
          <TootipWrapper>
            <TimerTooltip message={`${spotDetail.discountRate}% 할인 중`} bgColor={theme.brandColor} color={theme.white} minWidth='78px' />
          </TootipWrapper>
        )
      }
    </Container>
  );
}

const Container = styled.section`
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

const TootipWrapper = styled.article`
  position: absolute;
  top: -18%;
  right: 51%;
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

export default SpotDetailBottom;
