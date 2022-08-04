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
import { ISpotsDetail } from '@model/index';

interface IProps {
  isSearched?: boolean;
  spotSearchList?: ISpotsDetail[];
  spotListAllCheck?: boolean;
};

const SpotSearchMapPage = ({isSearched, spotSearchList, spotListAllCheck}: IProps): ReactElement => {
  const router = useRouter();
  const slideRef = useRef<HTMLElement | null | any>(null);
  const [currentIdx, setCurrentIdx] = useState({ current: 0, next: 0});
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number>(0);
  const [selectedSpotList, setSelectedSpotList] = useState([]);
  const [selected, setSelected] = useState<boolean>(false);
  const [showInfoWindow, setShowInfoWindow] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);

  const list = spotSearchList ?? [];
  const searchListLen = list.length;
  
  useEffect(()=> {
    if(slideRef.current){
      slideRef.current?.slickGoTo(selectedCarouselIndex);
    }
  }, [selectedCarouselIndex]);

  useEffect(()=> {
    setTimeout(()=> {
      setDragging(false);
    }, 500);
  }, []);

  const handleBeforeChange = useCallback(({current, next}) => {
    setCurrentIdx({current: current, next: next}),
    setDragging(true);
  }, [setDragging]);

  const handleAfterChange = useCallback((): void => {
    setDragging(false);
  }, [setDragging]);

  const selectedCurrentSlickIdx = useCallback((idx: number) => {
    setSelectedCarouselIndex(idx)
  }, []);

  const getSpotInfo = (i: any) => {
    setSelectedSpotList(i);
  };

  const setting = {
    arrows: false,
    dots: false,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: true,
    infinite: false,
    centerPadding: '30px',
    speed: 700,
    draggable: true,
    afterChange: handleAfterChange,
    beforeChange: (current: number, next: number) =>
    handleBeforeChange({current: current, next: next}),
  };

  return (
    <Container>
      <MapWrapper>
        <SpotSearchKakaoMap spotListAllCheck={spotListAllCheck} spotSearchList={list} zoom={3} currentSlickIdx={currentIdx.next} onClickCurrentSlickIdx={selectedCurrentSlickIdx} getSpotInfo={getSpotInfo} setSelected={setSelected} setShowInfoWindow={setShowInfoWindow} showInfoWindow={showInfoWindow}   />
        {
          selected && spotListAllCheck && (
            !showInfoWindow &&
            <SpotListWrapper>
              <SpotListSlider {...setting} ref={slideRef}>
                {selectedSpotList?.map((item, index) => (
                  <SpotsSearchResultList map item={item} key={index} />
                ))}
              </SpotListSlider>
            </SpotListWrapper>
          )
        }
        {
          searchListLen! > 0 && !spotListAllCheck && 
          (
            !showInfoWindow &&
            <SpotListWrapper>
              <SpotListSlider {...setting} ref={slideRef}>
                {list?.map((item, index) => (
                  <SpotsSearchResultList map item={item} key={index} dragging={dragging} />
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
const SpotListSlider = styled(Slider)`
  width: 100%;
  padding: 16px 0;
  .slick-slide > div {
    padding: 0 6px;
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
  z-index: 500;
`;

export default SpotSearchMapPage;
