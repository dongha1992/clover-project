import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled, {css} from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { 
  spotSelector, 
  SET_SPOT_MAP_SWITCH, 
  } from '@store/spot';
import { IMAGE_S3_DEV_URL } from '@constants/mock';
import { SET_ALERT } from '@store/alert';
import { ISpotsDetail } from '@model/index';
import { SVGIcon } from '@utils/common';
import { breakpoints } from '@utils/common/getMediaQuery';
import { theme } from '@styles/theme';

declare global {
  interface Window {
    getCurrentPosBtn: any;
    zoomIn: any;
    zoomOut: any;
  }
}

interface IProps {
  spotSearchList?: ISpotsDetail[];
  zoom?: number;
  centerLat?: number;
  centerLng?: number;
  currentSlickIdx?: number;
  onClickCurrentSlickIdx?: any;
  getSpotInfo?: any
  setSelected?: any;
  setShowInfoWindow?: any;
  showInfoWindow?: boolean;
  spotListAllCheck?: boolean;
};

const SpotSearchKakaoMap = ({
  spotSearchList,
  zoom,
  centerLat,
  centerLng,
  currentSlickIdx,
  onClickCurrentSlickIdx,
  getSpotInfo,
  setSelected,
  setShowInfoWindow,
  showInfoWindow,
  spotListAllCheck,
}: IProps) => {
  const dispatch = useDispatch();
  const [selectedSpotIdx, setSelectedSpotIdx] = useState<number | null>(0);
  const [successPosition, setSuccessPosition] = useState<boolean>(false);
  const [maxZoonOut, setMaxZoomOut] = useState<boolean>(false);
  const [minZoomIn, setMinZoomIn] = useState<boolean>(false);

  const spotList = spotSearchList ?? [];
  const idx = currentSlickIdx&&currentSlickIdx;
  const SelectedSpotArr = spotListAllCheck ?  spotList[selectedSpotIdx!] : spotList[idx!];
  const currentPositionLat = spotListAllCheck ? 37.52066637532468 : SelectedSpotArr?.coordinate.lat;
  const currentPositionLon =  spotListAllCheck ? 126.98082602361164 : SelectedSpotArr?.coordinate.lon;
  const level = zoom ? zoom : 3;
  const levelControl = spotListAllCheck ? 9 : level;


  useEffect(()=> {
    if(spotListAllCheck) {
      setShowInfoWindow(true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    onLoadKakaoMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotList, currentSlickIdx]);
    
  const onLoadKakaoMap = () => {
    try {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(currentPositionLat, currentPositionLon),
          level: levelControl,
          maxLevel: 9,
        };
        const map = new window.kakao.maps.Map(container, options); // 지도 생성
        const markerPosition = new window.kakao.maps.LatLng(currentPositionLat, currentPositionLon);
        const imageSize = new window.kakao.maps.Size(50, 54);
        const imageSrc = `${IMAGE_S3_DEV_URL}/ic_map_pin.png`;
        const selectedMarkerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); // 선택된 마커 이미지

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
            minLevel: 4, // 클러스터 할 최소 지도 레벨 
            calculator: [10, 100, 1000],
            minClusterSize: 3,
            styles: clusterStyles,
            zIndex: 700,
        });

        // 마커 리스트
        //ic_map_pin.png 선택 마커
        //ic_circle.png 프라이빗 마커
        //ic_bookstore.png 퍼블릭 마커
        //ic_cafe.png
        //ic_GS25.png
        //ic_gym.png
        //ic_pharmacy.png
        //ic_sevenelven.png
        //ic_store.png
        //ic_storyway.png
        //ic_cafe_storyway.png
        //ic_etc.png
        //ic_tripin.png

        //ic_group_pin.png // 클러스터링 마커 
        let selectedMarker: any = null;

        //   const filterResult = spotList.filter(i => i.type === 'PUBLIC');
        //   const result = filterResult?.reduce((acc: any, cur: any) => {
        //     acc[cur.location.address] = (acc[cur.location.address] || 0) + 1;
        //     return acc;
        //   }, {});

        // console.log('result', result);
        const markersArr: any[] =[];

        for (let i = 0; i < spotList.length; i++) {
          displayMarker(spotList[i], i);
        };

        function displayMarker (item: ISpotsDetail, idx: number) {

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
          const typeMarkersImage = new window.kakao.maps.MarkerImage(mapMarkerImgSrc, imageSize); // 타입별 마커 이미지
          const latlng = new window.kakao.maps.LatLng(item.coordinate.lat, item.coordinate.lon)
          const markers = new window.kakao.maps.Marker({ // 타입별 마커 생성
              map: map, // 마커를 표시할 지도
              position: latlng, // 마커를 표시할 위치
              image : typeMarkersImage, // 마커 이미지 
              zIndex: 600,
          });
          markers.typeMarkersImage = typeMarkersImage;
          markersArr.push(markers);

          if(currentSlickIdx === idx) { // 검색 결과에서 슬라이드 정보창 이동시 선택된 마커 유지
            markers.setImage(selectedMarkerImage);
            markers.setZIndex(700);
          };

          new window.kakao.maps.event.addListener(markers, 'click', function () { // 마커에 click 이벤트 등록
            if (spotListAllCheck) {
              // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면 마커의 이미지를 클릭 이미지로 변경
              if (!selectedMarker || selectedMarker !== markers) {
                // 클릭된 마커 객체가 null이 아니면 클릭된 마커의 이미지를 기본 이미지로 변경
                !!selectedMarker && selectedMarker.setImage(selectedMarker.typeMarkersImage);
                // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경
                markers.setImage(selectedMarkerImage); 
                markers.setZIndex(700);
              };
              selectedMarker = markers;
              // 클릭된 마커를 현재 클릭된 마커 객체로 설정
            } else if(currentSlickIdx === idx) { // 검색 결과에서 클릭한 마커 아이콘 변경
                markers.setImage(selectedMarkerImage);
                markers.setZIndex(700);
            };  
            
            map.setLevel(3); // 마커 클릭시 zoom level 3

            const moveLatLng = new window.kakao.maps.LatLng(item.coordinate.lat, item.coordinate.lon); 
            map.panTo(moveLatLng); // 클릭된 마커를 맵 중심으로 이동, 부드럽게 이동

            setShowInfoWindow(false); // 지도 클릭시 정보창 숨김 여부
            onClickCurrentSlickIdx(idx); // 검색 결과에서 마커 클릭시 해당 정보창으로 slide 이동
            setSelectedSpotIdx(idx);

            const selectedSpotMarker = spotList.filter(i => i.id === item.id);
            getSpotInfo(selectedSpotMarker); // 스팟 정보
            setSelected(true); // 전체 리스트에서 마커 클릭시 정보창 보임
          });

          new window.kakao.maps.event.addListener(map, 'click', function() { // 지도 click 이벤트 등록, 마커 클릭 해제
            markers.setImage(typeMarkersImage); // 지도 클릭시 선택된 마커 원복
            setShowInfoWindow(true); // 지도 클릭시 정보창 숨김 여부
          });
          clusterer.addMarkers(markersArr);
        };

        new window.kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster: any) {
          // 현재 지도 레벨에서 1레벨 확대한 레벨
          const level = map.getLevel()-1;
          // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
          map.setLevel(level, {anchor: cluster.getCenter()});
        });

        // 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수
        document.getElementById('zoomIn')?.addEventListener('click', function () {
          const getLevel = map.getLevel();
          const level = getLevel - 1;
          map.setLevel(level, {animate: true});
          setMaxZoomOut(false);
          if(getLevel <= 2) {
            setMinZoomIn(true);
          };
        });

        // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수
        document.getElementById('zoomOut')?.addEventListener('click', function () {
          const getLevel = map.getLevel();
          const level = getLevel + 1;
          map.setLevel(level, {animate: true});
          setMinZoomIn(false);
          if(getLevel >= 8){
            setMaxZoomOut(true);
          };
        });

        // 현재 위치 Geolocation API 호출
        const getCurrentPosBtn = () =>{
          if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position) => { // `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
              const currentPos = new window.kakao.maps.LatLng(position.coords.latitude,position.coords.longitude);
              map.setCenter(currentPos); // 현재 위치로 지도 이동
              map.setLevel(3);
              // 마커 생성
              const imageSrc = `${IMAGE_S3_DEV_URL}/ic_current_position.png`;
              const imageSize = new window.kakao.maps.Size(32, 36);
              const currentPositionIcon = new window.kakao.maps.MarkerImage(imageSrc, imageSize); 
              const marker = new window.kakao.maps.Marker({
                  position: currentPos,
                  image: currentPositionIcon,
                  zIdex: 900,
              });
              // 기존에 마커가 있다면 제거
              // markersArr.push(marker);
              marker.setMap(map);
              setSuccessPosition(true);
            },
            (error) => { // `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
              setSuccessPosition(false);
              console.error(error.message);
              dispatch(
                SET_ALERT({
                  alertMessage: '위치 서비스를 사용하려면\n접근 권한을 허용해 주세요.',
                  submitBtnText: '확인',
                })
              );  
            });
          };
        };
        document.getElementById('currentGeolocation')?.addEventListener('click', getCurrentPosBtn);

      });
    } catch(e){
      dispatch(
        SET_ALERT({
          alertMessage: '알 수 없는 에러가 발생했습니다.',
          submitBtnText: '확인',
          onSubmit: ()=> {
            dispatch(SET_SPOT_MAP_SWITCH(false));
          }
        })
      );
      console.error(e);
    }
  };

  return (
    <MapWrapper>
      <ZoomContralWrapper>
        <ZoomIn id='zoomIn'>
          <SVGIcon name={`${minZoomIn ? 'mapNoneZoomIn' : 'mapZoomIn'}`} />
        </ZoomIn>
        <Col />
        <ZoomOut id='zoomOut'>
          <SVGIcon name={`${maxZoonOut ? 'mapNoneZoomOut' : 'mapZoomOut'}`} />
        </ZoomOut>
      </ZoomContralWrapper>
      <SvgWrapper id='currentGeolocation' show={showInfoWindow!}>
        <SVGIcon name={successPosition ? "mapCurrentPositionActivedBtn" : "mapCurrentPositionBtn"} />
      </SvgWrapper>
      <Map id="map" ></Map>
    </MapWrapper>
  );
};

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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


const SvgWrapper = styled.div<{show: boolean}>`
  position: absolute;
  max-width: ${breakpoints.mobile}px;
  right: 20px;
  z-index: 500;
  cursor: pointer;
  ${({show}) => {
    if(!show){
      return css`
        bottom: 185px;
      `;
    } else {
      return css`
        bottom: 8px;
      `
    }
  }}
`;

const Map = styled.div`
  width: 100%;
  height: 100%;
  z-index: 100;
`;

export default SpotSearchKakaoMap;
