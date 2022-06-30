import React, { useEffect } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useSelector, useDispatch } from 'react-redux';
import { spotSelector, SET_SPOT_MAP_SWITCH } from '@store/spot';

interface IProps {
  title?: string;
}

const SpotSearchHeader = ({ title }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isMapSwitch } = useSelector(spotSelector);

  const goBack = (): void => {
    router.back();
  };

  const goToSwitchMap = () => {
    if(!isMapSwitch) {
      dispatch(SET_SPOT_MAP_SWITCH(true));
    } else {
      dispatch(SET_SPOT_MAP_SWITCH(false));
    }
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        { !isMapSwitch ? (
          <BtnWrapper>
            <div className="map" onClick={goToSwitchMap}>
              <SVGIcon name="map" />
            </div>
          </BtnWrapper>
        ) : (
          <BtnWrapper>
            <div className="threeLines" onClick={goToSwitchMap}>
              <SVGIcon name="threeLines" />
            </div>
          </BtnWrapper>
        )}
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

export default React.memo(SpotSearchHeader);
