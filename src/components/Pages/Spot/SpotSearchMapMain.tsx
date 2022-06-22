import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { theme, FlexEnd } from '@styles/theme';
import { TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { SVGIcon } from '@utils/common';
import { SpotSearchMapList } from '@components/Pages/Spot';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import Slider from 'react-slick';
import { SpotSearchMap } from '@components/Map';
import { spotSelector } from '@store/spot';
import { useDispatch, useSelector } from 'react-redux';

export interface IArea {
  location: string;
  lat: string;
  lng: string;
}

const SpotSearchMapMain = (): ReactElement => {
  const router = useRouter();
  const { spotSearchArr } = useSelector(spotSelector);

  const spotMapList = spotSearchArr&&spotSearchArr;

  const setting = {
    arrows: false,
    dots: false,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: true,
    infinite: false,
    centerPadding: '30px',
  };

  return (
    <Container>
      <MapWrapper>
        <SpotSearchMap />
        <SpotListWrapper>
          <SpotListSlider {...setting}>
            {spotMapList?.map((item, index) => (
              <SpotSearchMapList item={item} key={index} />
            ))}
          </SpotListSlider>
        </SpotListWrapper>
      </MapWrapper>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 56px);
`;

const MapWrapper = styled.section`
  width: 100%;
  height: 100%;
  background: ${theme.greyScale15};
`;
const SpotListSlider = styled(Slider)`
  width: 100%;
  padding: 16px 0;
  .slick-slide > div {
    padding: 0 5px;
  }
`;

const SpotListWrapper = styled.section`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  z-index: 50;
`;

export default SpotSearchMapMain;
