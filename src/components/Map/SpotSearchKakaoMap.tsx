import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { IMAGE_S3_DEV_URL } from '@constants/mock';

interface IProps {
  zoom?: number;
  centerLat?: number;
  centerLng?: number;
  currentIdx?: number;
  onClick?: any;
  selectedSpot?: any
  setSelected?: any;
};

const SpotSearchKakaoMap = ({
  zoom,
  centerLat,
  centerLng,
  currentIdx,
  onClick,
  selectedSpot,
  setSelected,
}: IProps) => {

  const { spotSearchArr } = useSelector(spotSelector);
  const spotList = spotSearchArr ?? [];
  const idx = currentIdx&&currentIdx;
  const SelectedSpotArr = spotList[idx ? idx : 0];
  const currentPositionLat = spotList?.length ? SelectedSpotArr?.coordinate.lat : 37.50101118367814;
  const currentPositionLon =  spotList?.length ? SelectedSpotArr?.coordinate.lon : 127.03525895821902;
  

  useEffect(() => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=clusterer`;
    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(currentPositionLat, currentPositionLon),
        level: zoom ? zoom : 3,
        maxLevel: 9,

      };
    
      const map = new window.kakao.maps.Map(container, options);
      const markerPosition = new window.kakao.maps.LatLng(currentPositionLat, currentPositionLon);
      const imageSize = new window.kakao.maps.Size(50, 52);
      const imageSrc = `${IMAGE_S3_DEV_URL}/ic_map_pin.png`;
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); 
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
    //marker.setMap(map);

    // 마커 클러스터러를 생성
    const clusterStyles = [
      {
        width : '30px', 
        height : '30px',
        color: 'white',
        textAlign: 'center',
        fontSize: '13px',
        background: `url(${IMAGE_S3_DEV_URL}/ic_group_pin.png) no-repeat center`,
        backgroundSize: '100% 100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '3px',
      },
      {
        width : '40px', 
        height : '40px',
        color: 'white',
        background: `url(${IMAGE_S3_DEV_URL}/ic_group_pin.png) no-repeat center`,
        backgroundSize: '100% 100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '3px',
      },
      {
        width : '50px', 
        height : '50px',
        color: 'white',
        fontSize: '15px',
        background: `url(${IMAGE_S3_DEV_URL}/ic_group_pin.png) no-repeat  center`,
        backgroundSize: '100% 100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '3px',
      },
    ];
    
    const clusterer = new window.kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 3, // 클러스터 할 최소 지도 레벨 
        calculator: [10, 100, 1000],
        minClusterSize: 3,
        styles: clusterStyles,
    });

    //pin list
    //ic_circle.png 프라이빗 마커
    //ic_bookstore.png
    //ic_cafe.png
    //ic_GS25.png
    //ic_gym.png
    //ic_map_pin.png
    //ic_pharmacy.png
    //ic_sevenelven.png
    //ic_store.png
    //ic_storyway.png
    //ic_cafe_storyway.png
    //ic_etc.png
    //ic_tripin.png

    //ic_group_pin.png
    const markersArr =[];

    for (let i = 0; i < spotList.length; i ++) {
        const placeType = () => {
          if (spotList[i].type === 'PRIVATE') {
            return '/ic_circle.png';
          } else if (spotList[i].type === 'PUBLIC') {
            switch(spotList[i].placeType){
              case 'CAFE':
                  return '/ic_cafe.png';
              case 'CONVENIENCE_STORE':
                  return '/ic_GS25.png';
              case 'ETC':
                  return '/ic_etc.png';
              case 'BOOKSTORE':
                  return '/ic_bookstore.png';
              case 'DRUGSTORE':
                  return '/ic_pharmacy.png';
              case 'FITNESS_CENTER':
                  return '/ic_gym.png';
              // case 'OFFICE':
              //     return '/ic_etc.png';
              // case 'SHARED_OFFICE':
              //     return '/ic_etc.png';
              case 'STORE':
                  return '/ic_store.png';
              // case 'SCHOOL':
              //     return '/ic_etc.png';
              default:
                  return '/ic_etc.png';
              };  
          }
        };

  // 마커 이미지의 이미지 크기 입니다
  
  // 마커 이미지를 생성합니다    
  const mapMarkerImgSrc = `${IMAGE_S3_DEV_URL}${placeType()}`;
  const imgSize = () => {
    if (spotList[i].type === 'PRIVATE') {
      return {
        x: 30,
        y: 30,
      }
    } else {
      return {
        x: 50,
        y: 50,
      }
    }
  }
  const imageSize = new window.kakao.maps.Size(imgSize().x, imgSize().y); 
  const markerImage = new window.kakao.maps.MarkerImage(mapMarkerImgSrc, imageSize); 
  const latlng = new window.kakao.maps.LatLng(spotList[i].coordinate.lat, spotList[i].coordinate.lon)
  // 마커를 생성합니다
  const markers = new window.kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: latlng, // 마커를 표시할 위치
      image : markerImage // 마커 이미지 
  });
  markersArr.push(markers);

    new window.kakao.maps.event.addListener(markers, 'click', function() {
      // 마커 위에 인포윈도우를 표시합니다
      onClick(i);
      selectedSpot(spotList[i]);
      setSelected(true);  
    });

  };
  clusterer.addMarkers(markersArr);

      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);
    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
    
  }, [spotList, currentIdx, currentPositionLat, currentPositionLon, zoom, onClick, selectedSpot, setSelected]);
    
  return (
    <MapContainer id="map"></MapContainer>
  );
};

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export default SpotSearchKakaoMap;
