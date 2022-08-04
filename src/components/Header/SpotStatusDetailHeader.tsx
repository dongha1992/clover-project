import React, { useEffect } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { SET_BOTTOM_SHEET, INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { commonSelector } from '@store/common';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';
import router from 'next/router';
import { spotSelector } from '@store/spot';
import { userForm } from '@store/user';

type TProps = {
  isMobile?: boolean;
};

/* TODO: Header props으로 svg만 추가 */

const SpotStatusDetailHeader = ({}: TProps) => {
  const dispatch = useDispatch();
  const { q_share } = router.query;
  const { isMobile } = useSelector(commonSelector);
  const { spotStatusDetail } = useSelector(spotSelector);
  const { me } = useSelector(userForm);
  const loginUserId = me?.id;

  useEffect(() => {
    return () => {
      dispatch(INIT_BOTTOM_SHEET());
    };
  }, []);

  const goBack = (): void => {
    if (q_share) {
      router.push('/spot');
    } else {
      router.back();
    }
  };

  const goToShare = () => {
    const currentUrl = window.location.href;
    const spotLink = `${currentUrl}?q_share=true`;
    if (isMobile) {
      if (navigator.share) {
        navigator
          .share({
            title: '트라이얼 프코스팟 공유 링크',
            url: spotLink,
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
          content: <ShareSheet spotLink={spotLink} />,
        })
      );
    }
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <BtnWrapper>
          {
            spotStatusDetail?.type === 'PRIVATE' && (loginUserId === spotStatusDetail?.userId) && (
              <div className="share" onClick={goToShare}>
                <SVGIcon name="share" />
              </div>  
            )
          }
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

export default React.memo(SpotStatusDetailHeader);
