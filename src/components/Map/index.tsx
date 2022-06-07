/* eslint-disable @next/next/no-sync-scripts */
import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { IArea } from '@pages/spot/search/location';
import { IMAGE_S3_DEV_URL } from '@constants/mock';

interface IProps {
  zoom?: number;
  centerLat?: number;
  centerLng?: number;
}

const MapAPI = ({ zoom, centerLat, centerLng }: IProps): ReactElement => {
  useEffect(() => {
    initMap();
  }, [centerLat, centerLng]);

  const initMap = () => {
    try {
      const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(
          Number(centerLat ? centerLat : 37.50101118367814),
          Number(centerLng ? centerLng : 127.03525895821902)
        ), // 최초 찍히는 마커
        zoom: zoom ? zoom : 18,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
      });
      let marker = new naver.maps.Marker({
        icon: {
          // 이미지 아이콘
          url: `${IMAGE_S3_DEV_URL}/ic_map_pin.png`,
          size: new naver.maps.Size(50, 52),
          anchor: new naver.maps.Point(25, 26),
          onClick: () => {
            alert('aa');
          },
        },
        position: new naver.maps.LatLng(
          Number(centerLat ? centerLat : 37.50101118367814),
          Number(centerLng ? centerLng : 127.03525895821902)
        ), // 최초 찍히는 마커
        map: map,
      });

      // if (areaArr) {
      //   for (let i = 0; i < areaArr.length; i++) {
      //     let marker = new naver.maps.Marker({
      //       map: map,
      //       title: areaArr[i].location,
      //       position: new naver.maps.LatLng(
      //         Number(areaArr[i].lat),
      //         Number(areaArr[i].lng)
      //       ),
      //         icon: { // 이미지 아이콘
      //           content: `<SVGIcon name='grayGood' />`,
      //           size: new naver.maps.Size(50, 52),
      //           origin: new naver.maps.Point(0, 0),
      //           anchor: new naver.maps.Point(25, 26)
      //       }
      //     });

      //     let infoWindow = new naver.maps.InfoWindow({
      //       content: `<div style='width: 200px; text-align: center; padding: 10px;'><b>${areaArr[i].location}</b><br> -프코스팟 지도-</div>`,
      //     });
      //     markers.push(marker); // 생성한 마커를 배열에 담는다.
      //     infoWindows.push(infoWindow); //  생성한 정보창을 배열에 담는다.
      //   }
      // }

      // function handleClickMarker(seq: number) {
      //   return function (e: React.ChangeEvent<HTMLInputElement>) {
      //     // 마커를 클릭하는 부분
      //     let marker = markers[seq], // 클릭한 마커의 시퀀스를 찾는다.
      //       infoWindow = infoWindows[seq];
      //     if (infoWindow.getMap()) {
      //       infoWindow.close();
      //     } else {
      //       infoWindow.open(map, marker); // 마커 정보 노출
      //     }
      //   };
      // }

      // for (let i = 0, ii = markers.length; i < ii; i++) {
      //   // console.log(markers[i], handleClickMarker(i));
      //   naver.maps.Event.addListener(markers[i], 'click', handleClickMarker(i)); // 클릭한 마커 핸들러
      // }
    } catch (error: any) {
      alert(error.message);
    }
  };

  //지도 사이즈 관련 스타일
  const mapStyle = {
    width: '100%',
    height: '100%',
    zIndex: 0,
  };

  return (
    <>
      <div id="map" style={mapStyle}></div>
    </>
  );
};

export default MapAPI;
