/* eslint-disable @next/next/no-sync-scripts */
import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { breakpoints } from '@utils/getMediaQuery';
import Head from 'next/head';
import SVGIcon from '@utils/SVGIcon';

interface Iprops {
  zoom?: number;
  centerLat?: string;
  centerLng?: string;
  areaArr?: [
    {
      location: string;
      lat: string;
      lng: string;
    }
  ];
}

const MapAPI = ({
  zoom,
  centerLat,
  centerLng,
  areaArr,
}: Iprops): ReactElement => {
  useEffect(() => {
    initMap();
  }, [centerLat, centerLng]);

  const initMap = () => {
    // const HOME_PATH = window.HOME_PATH || '.';
    const markers = new Array();
    const infoWindows = new Array();

    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(
        Number(centerLat ? centerLat : '37.413294'),
        Number(centerLng ? centerLng : '127.269311')
      ), // 최초 찍히는 마커
      zoom: zoom ? zoom : 17,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
    });
    let marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(Number(centerLat), Number(centerLng)),
      map: map,
    });

    if (areaArr) {
      for (let i = 0; i < areaArr.length; i++) {
        let marker = new naver.maps.Marker({
          map: map,
          title: areaArr[i].location,
          position: new naver.maps.LatLng(
            Number(areaArr[i].lat),
            Number(areaArr[i].lng)
          ),
          //   icon: { // 이미지 아이콘
          //     url: '',
          //     size: new naver.maps.Size(50, 52),
          //     origin: new naver.maps.Point(0, 0),
          //     anchor: new naver.maps.Point(25, 26)
          // }
        });

        let infoWindow = new naver.maps.InfoWindow({
          content: `<div style='width: 200px; text-align: center; padding: 10px;'><b>${areaArr[i].location}</b><br> -프코스팟 지도-</div>`,
        });
        markers.push(marker); // 생성한 마커를 배열에 담는다.
        infoWindows.push(infoWindow); //  생성한 정보창을 배열에 담는다.
      }
    }
    function handleClickMarker(seq: number) {
      return function (e: React.ChangeEvent<HTMLInputElement>) {
        // 마커를 클릭하는 부분
        let marker = markers[seq], // 클릭한 마커의 시퀀스를 찾는다.
          infoWindow = infoWindows[seq];
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker); // 마커 정보 노출
        }
      };
    }
    for (let i = 0, ii = markers.length; i < ii; i++) {
      // console.log(markers[i], handleClickMarker(i));
      naver.maps.Event.addListener(markers[i], 'click', handleClickMarker(i)); // 클릭한 마커 핸들러
    }
  };

  //지도 사이즈 관련 스타일
  const mapStyle = {
    width: '100%',
    height: '100%',
  };

  return <div id="map" style={mapStyle}></div>;
};

export default MapAPI;
