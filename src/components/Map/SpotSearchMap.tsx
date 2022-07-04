import React, { ReactElement, FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IMAGE_S3_DEV_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import {ISpotsDetail} from '@model/index';
import { lt } from '@fxts/core';


  interface IProps {
    zoom?: number;
    centerLat?: string;
    centerLng?: string;
    currentIdx?: number;
  };
  
  const SpotSearchMap = ({
    zoom,
    centerLat,
    centerLng,
    currentIdx,
  }: IProps): ReactElement => {
  const { spotSearchArr } = useSelector(spotSelector);

  const spotsArr = spotSearchArr ?? [];
  const idx = currentIdx&&currentIdx;
  const SelectedSpotArr = spotsArr[idx ? idx : 0];

    useEffect(() => {
      const initMap = () => {
        const markers: naver.maps.Marker[] = []; // 마커 정보를 담는 배열
        let infoWindows = []; // 정보창을 담는 배열
        const currentPositionLat = spotsArr?.length ? SelectedSpotArr?.coordinate.lat : 37.50101118367814;
        const currentPositionLon =  spotsArr?.length ? SelectedSpotArr?.coordinate.lon : 127.03525895821902;
        const map = new naver.maps.Map('map', {
            center: new naver.maps.LatLng(currentPositionLat, currentPositionLon), //지도 시작 지점
            zoom: zoom ? zoom : 19,
        });
        const marker = new naver.maps.Marker({
          icon: { // 이미지 아이콘
            url: `${IMAGE_S3_DEV_URL}/ic_map_pin.png`,
            size: new naver.maps.Size(50, 52),
            anchor: new naver.maps.Point(25, 26),
            // onClick: () => {}
        },
          position: new naver.maps.LatLng(currentPositionLat, currentPositionLon), // 최초 찍히는 마커
          map: map,
        });
        // pin list
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

        for (let i=0; i < spotsArr?.length!; i++) {
            const placeType = () => {
              switch(spotsArr[i].placeType){
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
                  return '/ic_shared_office.png';
                case 'STORE':
                  return '/ic_store.png';
                case 'SCHOOL':
                  return '/ic_etc.png';
                default:
                  return '/ic_circle.png';
              };
            };
          let spot = spotsArr[i],
          latlng = new naver.maps.LatLng(spot.coordinate.lat, spot.coordinate.lon),
          marker = new naver.maps.Marker({
              map: map,
              draggable: false,
              zIndex: 100,
              position: latlng,
              icon: { // 이미지 아이콘
              url: `${spotsArr[i].type === 'PRIVATE' ?`${IMAGE_S3_DEV_URL}/ic_circle.png` :`${IMAGE_S3_DEV_URL}${placeType()}`}`,
              size: new naver.maps.Size(50, 52),
              anchor: new naver.maps.Point(25, 26),
              
            //   onClick: () => {}
            },
          })
        markers.push(marker); 

        naver.maps.Event.addListener(marker, "click", (e: any) => {
          const latLng = new naver.maps.LatLng(
            Number(spot.coordinate.lat),
            Number(spot.coordinate.lon)
          );
          map.panTo(latLng, e?.coord);
          
        });

      }

    //   let htmlMarker1 = {
    //     content: `<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(${IMAGE_S3_DEV_URL}/ic_group_pin.png);background-size:contain;"></div>`,
    //     size: new naver.maps.Size(40, 40),
    //     anchor: new naver.maps.Point(20, 20)
    //   };

    //   let markerClustering = new MarkerClustering({
    //     minClusterSize: 2,
    //     maxZoom: 13,
    //     map: map,
    //     markers: markers,
    //     disableClickZoom: false,
    //     gridSize: 120,
    //     icons: [htmlMarker1],
    //     indexGenerator: [10, 100, 200, 500, 1000],
    //     stylingFunction: function(clusterMarker: { getElement: () => any; }, count: any) {
    //         $(clusterMarker.getElement()).find('div:first-child').text(count);
    //     }
    // });

        // const map = new naver.maps.Map('map', {
        //   center: new naver.maps.LatLng(
        //     Number(centerLat ? centerLat : '37.413294'),
        //     Number(centerLng ? centerLng : '127.269311')
        //   ), // 최초 찍히는 마커
        //   zoom: zoom ? zoom : 17,
        //   zoomControl: true,
        //   zoomControlOptions: {
        //     style: naver.maps.ZoomControlStyle.SMALL,
        //     position: naver.maps.Position.TOP_RIGHT,
        //   },
        // });
        // let marker = new naver.maps.Marker({
        //   icon: { // 이미지 아이콘
        //     url: `${IMAGE_S3_DEV_URL}/ic_map_pin.png`,
        //     size: new naver.maps.Size(50, 52),
        //     anchor: new naver.maps.Point(25, 26),
        //     onClick: () => {}
        // },
        //   position: new naver.maps.LatLng(Number(centerLat), Number(centerLng)), // 최초 찍히는 마커
        //   map: map,
        // });
    
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
      };
    
      initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotsArr, currentIdx]);
  
    // let markers: any[] = [];

    // const getClickHandler = seq => {
    //   return function (e) {
       
    //   }
    // };
   
    // for(let i = 0;  i < spotsArr.length; i++){
    //   naver.maps.Event.addListener(markers[i], 'click', getClickHandler);
    // }
  
  
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
  
export default SpotSearchMap;
