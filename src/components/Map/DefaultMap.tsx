/* eslint-disable @next/next/no-sync-scripts */
import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { IMAGE_S3_DEV_URL } from '@constants/mock';

interface IProps {
  zoom?: number;
  centerLat?: number;
  centerLng?: number;
}

const DefaultMap = ({
  zoom,
  centerLat,
  centerLng,
}: IProps): ReactElement => {


  useEffect(() => {
    const initMap = () => {
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
        icon: { // 이미지 아이콘
          url: `${IMAGE_S3_DEV_URL}/ic_map_pin.png`,
          size: new naver.maps.Size(50, 52),
          anchor: new naver.maps.Point(25, 26),
        //   onClick: () => {}
      },
        position: new naver.maps.LatLng(Number(centerLat), Number(centerLng)), // 최초 찍히는 마커
        map: map,
        draggable: false,
      });
    };
  
    initMap();
  }, [centerLat, centerLng]);

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

export default DefaultMap;