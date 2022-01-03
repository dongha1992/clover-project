import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { theme, FlexEnd } from '@styles/theme';
import { TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import SVGIcon from '@utils/SVGIcon';
import SpotItem from '@components/Pages/Spot/SpotItem';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/getMediaQuery';
import Slider from 'react-slick';
import Map from '@components/Map';

const SPOT_RECOMMEND_LIST = [
  {
    id: 1,
    name: '헤이그라운드 서울숲점',
    address: '서울 성동구 왕십리로 115 10층',
    meter: 121,
    type: '픽업',
    availableTime: '12:00-12:30 / 15:30-18:00',
    spaceType: ['프라이빗', '5% 할인중'],
    url: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
  },
  {
    id: 2,
    name: '헤이그라운드 성수점',
    address: '서울 성동구 왕십리로 115 10층',
    meter: 11,
    type: '픽업',
    availableTime: '12:00-12:30 / 15:30-18:00',
    spaceType: '퍼블릭',
    url: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
  },
  {
    id: 3,
    name: '헤이그라운드 성수시작점',
    address: '서울 성동구 왕십리로 115 10층 ㅁㄴㅇㅁㄴ',
    meter: 11,
    type: '픽업',
    availableTime: '12:00-12:30 / 15:30-18:00',
    spaceType: '트라이얼',
    url: 'https://image.ajunews.com/content/image/2020/08/29/20200829141039628211.jpg',
  },
];

const area = [
  {
    location: '프레시코드',
    lat: '37.547907',
    lng: '127.044112',
  },
  {
    location: '강남',
    lat: '37.4959854',
    lng: '127.0664091',
  },
  {
    location: '강동',
    lat: '37.5492077',
    lng: '127.1464824',
  },
  {
    location: '동대문',
    lat: '37.5838012',
    lng: '127.0507003',
  },
  {
    location: '광진',
    lat: '37.5574120',
    lng: '127.0796211',
  },
  {
    location: '송파',
    lat: '37.5177941',
    lng: '123.1127078',
  },
  {
    location: '용산',
    lat: '37.5311008',
    lng: '123.9810742',
  },
];

const SpotLocationPage = (): ReactElement => {
  const router = useRouter();

  const goToSpot = (): void => {};

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
      <Wrapper>
        <TextInput
          placeholder="도로명, 건물명 또는 지번으로 검색"
          svg="searchIcon"
          //   keyPressHandler={getSearchResult}
          //   eventHandler={changeInputHandler}
          //   ref={inputRef}
        />
        <FlexEnd padding="0 0 24px 0" margin="16px 0 0 0">
          <SVGIcon name="locationBlack" />
          <TextH6B margin="0 0 0 2px" padding="3px 0 0 0">
            현 위치로 설정하기
          </TextH6B>
        </FlexEnd>
      </Wrapper>
      <MapWrapper>
        <Map
          zoom={17}
          centerLat={area[2].lat}
          centerLng={area[2].lng}
          areaArr={area}
        />
        <SpotListWrapper>
          <SpotListSlider {...setting}>
            {SPOT_RECOMMEND_LIST.map((item: any, index) => (
              <SpotItem item={item} key={index} onClick={goToSpot} mapList />
            ))}
          </SpotListSlider>
        </SpotListWrapper>
      </MapWrapper>
    </Container>
  );
};

const Container = styled.main`
  position: relative;
`;

const Wrapper = styled.div`
  padding: 8px 24px;
`;

const MapWrapper = styled.section`
  width: 100%;
  height: 80vh;
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

export default SpotLocationPage;
