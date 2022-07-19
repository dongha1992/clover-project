import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { IMAGE_S3_DEV_URL } from '@constants/mock';
import { SVGIcon } from '@utils/common';
import { breakpoints } from '@utils/common/getMediaQuery';
import { theme } from '@styles/theme';

declare global {
  interface Window {
    zoomIn: any;
    zoomOut: any;
  }
};

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
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services,clusterer`;
    document.head.appendChild(mapScript);

    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerLat, centerLng]);

  const onLoadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const imageSrc = `${IMAGE_S3_DEV_URL}/ic_map_pin.png`;
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
      const zoomIn = () => {
        const level = map.getLevel() - 1;
        map.setLevel(level);
      };

      // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수
      const zoomOut = () => {
        const level = map.getLevel() + 1;
        map.setLevel(level);
      };

      window.zoomIn = zoomIn;
      window.zoomOut = zoomOut;
      
    });
  };

  return (
    <MapWrapper>
      <ZoomContralWrapper>
        <ZoomIn onClick={()=>window.zoomIn()}>
          <SVGIcon name='mapZoomIn' />
        </ZoomIn>
        <Col />
        <ZoomOut onClick={()=>window.zoomOut()}>
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
