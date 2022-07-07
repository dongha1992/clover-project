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
          image: markerImage
        };
        
        const map = new window.kakao.maps.Map(container, options);
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
