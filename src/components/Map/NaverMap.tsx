import React, { ReactElement, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { IMAGE_S3_DEV_URL } from '@constants/mock';

interface IProps {
  zoom?: number;
  centerLat?: string;
  centerLng?: string;
  currentIdx?: number;
  onClick?: any;
  selectedSpot?: any
  setSelected?: any;
};

const NaverMap = ({
    zoom,
    centerLat,
    centerLng,
    currentIdx,
    onClick,
    selectedSpot,
    setSelected,
  }: IProps): ReactElement => {
  const mapRef = useRef<HTMLElement | null | any>(null);
  const { spotSearchArr } = useSelector(spotSelector);
  const spotList = spotSearchArr ?? [];
  const idx = currentIdx&&currentIdx;
  const SelectedSpotArr = spotList[idx ? idx : 0];
  const currentPositionLat = spotList?.length ? SelectedSpotArr?.coordinate.lat : 37.50101118367814;
  const currentPositionLon =  spotList?.length ? SelectedSpotArr?.coordinate.lon : 127.03525895821902;

  useEffect(() => {
    mapRef.current = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(currentPositionLat, currentPositionLon),
        zoomControl: false,
    });
    const marker = new naver.maps.Marker({
      zIndex: 900,
      icon: { // 이미지 아이콘
        url: `${IMAGE_S3_DEV_URL}/ic_map_pin.png`,
        size: new naver.maps.Size(50, 52),
        anchor: new naver.maps.Point(25, 26),
        // onClick: () => {}
    },
      position: new naver.maps.LatLng(currentPositionLat, currentPositionLon), // 최초 찍히는 마커
      map: mapRef.current,
    });

    if (spotList) {
      spotList.map((list, index) => {
      
        // pin list
      //ic_group_pin.png
                
      // ic_bookstore.png
      // ic_cafe.png
      // ic_circle.png
      // ic_GS25.png
      // ic_gym.png
      // ic_map_pin.png
      // ic_pharmacy.png
      // ic_sevenelven.png
      // ic_store.png
      // ic_storyway.png
      // ic_cafe_storyway.png
      // ic_etc.png
      // ic_tripin.png

      //ic_group_pin.png

        const placeType = () => {
            switch(list.placeType){
              case 'CAFE':
                return '/ic_cafe.png';
              case 'CONVENIENCE_STORE':
                return '/ic_etc.png';
              case 'ETC':
                return '/ic_etc.png';
              case 'BOOKSTORE':
                return '/ic_bookstore.png';
              case 'DRUGSTORE':
                return '/ic_pharmacy.png';
              case 'FITNESS_CENTER':
                return '/ic_gym.png';
              case 'OFFICE':
                return '/ic_etc.png';
              case 'SHARED_OFFICE':
                return '/ic_etc.png';
              case 'STORE':
                return '/ic_store.png';
              case 'SCHOOL':
                return '/ic_etc.png';
              default:
                return '/ic_circle.png';
            };
          };
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(
            list.coordinate.lat,
            list.coordinate.lon
          ),
          map: mapRef.current,
          icon: { // 이미지 아이콘
            url: `${list.type === 'PRIVATE' ? `${IMAGE_S3_DEV_URL}/ic_circle.png` : `${IMAGE_S3_DEV_URL}${placeType()}`}`,
            size: new naver.maps.Size(50, 52),
            anchor: new naver.maps.Point(25, 26),
          },
          zIndex: 100,
        });

        naver.maps.Event.addListener(marker, "click", (e: any) => {
          const latLng = new naver.maps.LatLng(
            Number(list.coordinate.lat),
            Number(list.coordinate.lon)
          );
          // mapRef.current.morph(latLng, 16, e?.coord);
          // mapRef.current.panTo(latLng, e?.coord);
          onClick(index);
          selectedSpot(list);
          setSelected(true);
        });    
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotList, currentIdx]);

  const mapStyle = {
    width: '100%',
    height: '100%',
    zIndex: 0,
  };

  return <NaverMapContainer id="map"></NaverMapContainer>

};

const NaverMapContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export default NaverMap;