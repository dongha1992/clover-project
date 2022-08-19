import React from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useSelector } from 'react-redux';
import router from 'next/router';
import { spotSelector } from '@store/spot';
import { userForm } from '@store/user';
import ShareUrl from '@components/ShareUrl';

type TProps = {
  isMobile?: boolean;
};

/* TODO: Header props으로 svg만 추가 */

const SpotStatusDetailHeader = ({}: TProps) => {
  const { q_share } = router.query;
  const { spotStatusDetail } = useSelector(spotSelector);
  const { me } = useSelector(userForm);
  const loginUserId = me?.id;
  const currentUrl = window.location.href;
  const spotLink = `${currentUrl}?q_share=true`;

  const goBack = (): void => {
    if (q_share) {
      router.push('/spot');
    } else {
      router.back();
    }
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <BtnWrapper>
          {spotStatusDetail?.type === 'PRIVATE' && loginUserId === spotStatusDetail?.userId && (
            <ShareUrl className="share" title="트라이얼 프코스팟 공유 링크" linkUrl={spotLink}>
              <SVGIcon name="share" />
            </ShareUrl>
          )}
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
