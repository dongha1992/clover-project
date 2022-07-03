import React, { ReactElement, useRef, useState, useEffect } from 'react';
import styled, {css} from 'styled-components';
import { theme, FlexEnd } from '@styles/theme';
import { TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { SVGIcon } from '@utils/common';
import { SpotsSearchResultList } from '@components/Pages/Spot';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import Slider from 'react-slick';
import { SpotSearchMap, NaverMap } from '@components/Map';
import { spotSelector } from '@store/spot';
import { useDispatch, useSelector } from 'react-redux';

interface IProps {
  isSearched?: boolean;
  searchListLen?: number;
};

const SpotSearchMapPage = ({isSearched, searchListLen}: IProps): ReactElement => {
  const router = useRouter();
  const slideRef = useRef<HTMLElement | null | any>(null);
  const { spotSearchArr } = useSelector(spotSelector);
  const [currentIdx, setCurrentIdx] = useState({ current: 0, next: 0});
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number>(0);
  const [selectedSpotList, setSelectedSpotList] = useState({});
  const [selected, setSelected] = useState<boolean>(false);
  const list = spotSearchArr ?? [];

  useEffect(()=> {
    if(slideRef.current){
      slideRef.current?.slickGoTo(selectedCarouselIndex);
    }
  }, [selectedCarouselIndex]);

  const setting = {
    arrows: false,
    dots: false,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: true,
    infinite: false,
    centerPadding: '30px',
    beforeChange: (current: number, next: number) =>
    setCurrentIdx({current: current, next: next}),
  };

  const selectedSlickIdx = (i: number) => {
    setSelectedCarouselIndex(i)
  };

  const selectedSpot = (i: any) => {
    setSelectedSpotList(i);
  };

  return (
    <Container>
      <MapWrapper>
        <NaverMap currentIdx={currentIdx.next} onClick={selectedSlickIdx} selectedSpot={selectedSpot} setSelected={setSelected}   />
        {
          selected && !isSearched &&
          <SpotListWrapper>
            <SpotListSlider piece={true}>
              <SpotsSearchResultList map item={selectedSpotList} />
            </SpotListSlider>
          </SpotListWrapper>
        }
        {
          isSearched && searchListLen! > 0 && (
            <SpotListWrapper>
              <SpotListSlider {...setting} ref={slideRef}>
                {list?.map((item, index) => (
                  <SpotsSearchResultList map item={item} key={index} />
                ))}
              </SpotListSlider>
            </SpotListWrapper>
          ) 
        }
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
const SpotListSlider = styled(Slider)<{piece?: boolean}>`
  width: 100%;
  padding: 16px 0;
  .slick-slide > div {
    ${({piece}) => {
      if (piece) {
        return css `
          padding: 0px 30px;
        `;
      } else {
        return css `
          padding: 0 6px;
        `;
      }
    }}
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

export default SpotSearchMapPage;
