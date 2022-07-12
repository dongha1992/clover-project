import React, { ReactElement, useRef, useState, useEffect, useCallback } from 'react';
import styled, {css} from 'styled-components';
import { theme, FlexEnd } from '@styles/theme';
import { TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { SVGIcon } from '@utils/common';
import { SpotsSearchResultList } from '@components/Pages/Spot';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import Slider from 'react-slick';
import { SpotSearchKakaoMap } from '@components/Map';
import { spotSelector } from '@store/spot';
import { useDispatch, useSelector } from 'react-redux';

interface IProps {
  isSearched?: boolean;
  searchListLen?: number;
};

const SpotSearchMapPage = ({isSearched, searchListLen}: IProps): ReactElement => {
  const router = useRouter();
  const slideRef = useRef<HTMLElement | null | any>(null);
  const { spotSearchArr, spotListAllChecked } = useSelector(spotSelector);
  const [currentIdx, setCurrentIdx] = useState({ current: 0, next: 0});
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number>(0);
  const [selectedSpotList, setSelectedSpotList] = useState({});
  const [selected, setSelected] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
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
    speed: 700,
    beforeChange: (current: number, next: number) =>
    setCurrentIdx({current: current, next: next}),
  };

  const selectedCurrentSlickIdx = useCallback((idx: number) => {
    setSelectedCarouselIndex(idx)
  }, []);

  const getSpotInfo = (i: any) => {
    setSelectedSpotList(i);
  };

  return (
    <Container>
      <MapWrapper>
        <SpotSearchKakaoMap zoom={2} currentSlickIdx={currentIdx.next} onClickCurrentSlickIdx={selectedCurrentSlickIdx} getSpotInfo={getSpotInfo} setSelected={setSelected} setVisible={setVisible}   />
        {
          selected && spotListAllChecked && (
            !visible &&
            <SpotListWrapper>
            <SpotListSlider piece={true}>
              <SpotsSearchResultList map item={selectedSpotList} />
            </SpotListSlider>
          </SpotListWrapper>

          )
        }
        {
          searchListLen! > 0 && !spotListAllChecked && 
          (
            !visible &&
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
