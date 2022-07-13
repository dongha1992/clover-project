import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { IMAGE_S3_DEV_URL } from '@constants/mock';

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
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false`;
    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const imageSrc = `${IMAGE_S3_DEV_URL}/ic_map_pin.png`;
        const imageSize = new window.kakao.maps.Size(50, 52);
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); 

        const container = document.getElementById("maps");
        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: zoom ? zoom : 3,
          image: markerImage,
          maxLevel: 7,
        };
        
        const map = new window.kakao.maps.Map(container, options);
        
        const zoomControl = new window.kakao.maps.ZoomControl(); // 줌 컨트롤러
        const zoomControlPosition = window.kakao.maps.ControlPosition.RIGHT;
        map.addControl(zoomControl, zoomControlPosition); //지도 오른쪽에 줌 컨트롤이 표시되도록 지도에 컨트롤을 추가

        const markerPosition = new window.kakao.maps.LatLng(centerLat, centerLng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });
        marker.setMap(map);      
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
  }, [centerLat, centerLng]);

  return (
    <MapContainer id="maps"></MapContainer>
  );
};

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export default DefaultKakaoMap;
