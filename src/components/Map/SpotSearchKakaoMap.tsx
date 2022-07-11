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
  selectedTest?: any;
  selected?: boolean;
};

const SpotSearchKakaoMap = ({
  zoom,
  centerLat,
  centerLng,
  currentIdx,
  onClick,
  selectedSpot,
  setSelected,
  selectedTest,
  selected,
}: IProps) => {


  const { spotSearchArr, spotListAllChecked } = useSelector(spotSelector);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [clickLevel, setClickLevel] = useState<number>(9);
  const spotList = spotSearchArr ?? [];
  const idx = currentIdx&&currentIdx;
  const SelectedSpotArr = spotListAllChecked ?  spotList[selectedIdx] : spotList[idx!];
  const currentPositionLat = SelectedSpotArr?.coordinate.lat;
  const currentPositionLon =  SelectedSpotArr?.coordinate.lon;
  const level = zoom ? zoom : 2;
  const levelControl = spotListAllChecked ? 9 : level;
  // console.log('spotListAllChecked', spotListAllChecked);
  // console.log('currentIdx', currentIdx, 'selectedIdx', selectedIdx);

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
          level: levelControl,
          maxLevel: 9,
        };
        const map = new window.kakao.maps.Map(container, options); // 지도 생성

        const zoomControl = new window.kakao.maps.ZoomControl(); // 줌 컨트롤러
        const zoomControlPosition = window.kakao.maps.ControlPosition.RIGHT;
        map.addControl(zoomControl, zoomControlPosition); //지도 오른쪽에 줌 컨트롤이 표시되도록 지도에 컨트롤을 추가
        const markerPosition = new window.kakao.maps.LatLng(currentPositionLat, currentPositionLon);
        const imageSize = new window.kakao.maps.Size(50, 52);
        const imageSrc = `${IMAGE_S3_DEV_URL}/ic_map_pin.png`;
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); 
        if (!spotListAllChecked) {
          const markers = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
            zIndex: 100,
            visible: false,
          });
          markers.setMap(map);
        };

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

        for (let i = 0; i < spotList.length; i ++) {
          displayMarker(spotList[i], i);
        };

        function displayMarker (item: any, idx: number) {
          const markersArr =[];

          const placeType = () => {
            switch(item.spotMarker) {
              case 'PRIVATE': 
                return '/ic_circle.png';
              case 'BOOKSTORE': 
                return '/ic_bookstore.png';
              case 'CAFE': 
                return '/ic_cafe.png';
              case 'CAFE_STORYWAY':
                return '/ic_cafe_storyway.png';
              case 'CAFE_TRIPIN':
                return '/ic_tripin.png';
              case 'CONVENIENCE_STORE_GS25':
                return '/ic_GS25.png';
              case 'CONVENIENCE_STORE_SEVEN_ELEVEN':
                return '/ic_seveneleven.png';
              case 'CONVENIENCE_STORE_STORYWAY':
                return '/ic_storyway.png';
              case 'DRUGSTORE':
                return '/ic_pharmacy.png';
              case 'ETC':
                return '/ic_etc.png';
              case 'FITNESS_CENTER':
                return '/ic_gym.png';
              case 'STORE':
                return '/ic_store.png';
              default: 
                return '/ic_etc.png';
            };
          };
          
          // 마커 이미지를 생성
          const mapMarkerImgSrc = `${IMAGE_S3_DEV_URL}${placeType()}`;
          const imgSize = () => {
            if (item.type === 'PRIVATE') {
              return {
                x: 30,
                y: 30,
              };
            } else {
              return {
                x: 50,
                y: 50,
              }
            };
          };
          const imageSize = new window.kakao.maps.Size(imgSize().x, imgSize().y); 
          const markerImage = new window.kakao.maps.MarkerImage(mapMarkerImgSrc, imageSize); 
          const latlng = new window.kakao.maps.LatLng(item.coordinate.lat, item.coordinate.lon)
          // 마커를 생성합니다
          // map.panTo(latlng);
          const markers = new window.kakao.maps.Marker({
              map: map, // 마커를 표시할 지도
              position: latlng, // 마커를 표시할 위치
              image : markerImage, // 마커 이미지 
          });
          markersArr.push(markers);

          new window.kakao.maps.event.addListener(markers, 'click', function() {
            const defaultMarkerImage = new window.kakao.maps.MarkerImage(
              `${IMAGE_S3_DEV_URL}/ic_map_pin.png`,
              new window.kakao.maps.Size(50, 52));
            markers.setImage(defaultMarkerImage);
            selectedTest(false);
            onClick(idx);
            selectedSpot(item);
            setSelectedIdx(idx);
            setSelected(true);  
          });

          new window.kakao.maps.event.addListener(map, 'click', function() {
            selectedTest(true);
            const markerImage = new window.kakao.maps.MarkerImage(mapMarkerImgSrc, imageSize); 
            markers.setImage(markerImage);
          });
          clusterer.addMarkers(markersArr);
        };
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);
    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotList, currentIdx, onClick, selectedSpot, setSelected, selectedTest]);
    
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
