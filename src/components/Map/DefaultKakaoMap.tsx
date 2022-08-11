import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { breakpoints } from '@utils/common/getMediaQuery';
import { theme } from '@styles/theme';

interface IProps {
  zoom?: number;
  centerLat?: number;
  centerLng?: number;
};
  
const DefaultKakaoMap = ({
  zoom,
  centerLat,
  centerLng,
}: IProps) => {

  useEffect(() => {
    onLoadKakaoMap();
  }, [centerLat, centerLng]);

  const onLoadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const imageSrc = '/images/fcospot-map/ic_fcospot_DEFAULT_PIN.png';
      const imageSize = new window.kakao.maps.Size(50, 54);
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); 

      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(centerLat, centerLng),
        level: zoom ? zoom : 3,
        image: markerImage,
        maxLevel: 7,
      };
      
      const map = new window.kakao.maps.Map(container, options);
      const markerPosition = new window.kakao.maps.LatLng(centerLat, centerLng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      marker.setMap(map);

      // 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수
      document.getElementById('defaultMapZoomIn')?.addEventListener('click', function () {
        const getLevel = map.getLevel();
        const level = getLevel - 1;
        map.setLevel(level, {animate: true});
      });
      
      // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수
      document.getElementById('defaultMapZoomOut')?.addEventListener('click', function () {
        const getLevel = map.getLevel();
        const level = getLevel + 1;
        map.setLevel(level, {animate: true});
      });
    });
  };

  return (
    <MapWrapper>
      <ZoomContralWrapper>
        <ZoomIn id='defaultMapZoomIn'>
          <SVGIcon name='mapZoomIn' />
        </ZoomIn>
        <Col />
        <ZoomOut id='defaultMapZoomOut'>
          <SVGIcon name='mapZoomOut' />
        </ZoomOut>
      </ZoomContralWrapper>
      <Map id="map"></Map>
    </MapWrapper>
  );
};

const MapWrapper = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 5;
`;

const ZoomContralWrapper = styled.div`
  max-width: ${breakpoints.mobile}px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  z-index: 500;
  display: flex;
  flex-direction: column;
  padding: 24px;
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
`;

const ZoomIn = styled.span`
`;

const ZoomOut = styled.span`
  position: absolute;
  bottom: -12px;
`;

const Col = styled.div`
  width: 100%;
  height: 1px;
  background: ${theme.greyScale25};
  position: relative;
  z-index: 500;
  top: -4px;
`;

const Map = styled.div`
  width: 100%;
  height: 100%;
  z-index: 100;
`;

export default DefaultKakaoMap;
