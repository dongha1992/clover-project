import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { TimerTooltip } from '@components/Shared/Tooltip';
import {   
  postSpotLike,
  deleteSpotLike,
  getSpotLike,
 } from '@api/spot';
 import { SET_SPOT_LIKED } from '@store/spot';
import { useDispatch } from 'react-redux';
import { SET_USER_DESTINATION_STATUS, SET_DESTINATION, SET_TEMP_DESTINATION } from '@store/destination';
 
/*TODO: 재입고 알림등 리덕스에서 메뉴 정보 가져와야 함s*/
const SpotDetailBottom = () => {
  const dispatch = useDispatch();
  const { isDelivery } = router.query;
  const { spotDetail } = useSelector(spotSelector);
  const [spotLike, setSpotLike] = useState(spotDetail?.liked);

  const pickUpTime = `${spotDetail?.lunchDeliveryStartTime}-${spotDetail?.lunchDeliveryEndTime} / ${spotDetail?.dinnerDeliveryStartTime}-${spotDetail?.dinnerDeliveryEndTime}`;
  const goToCart = (e: any): void => {
    e.stopPropagation();
    const destinationInfo = {
      name: spotDetail?.name!,
      location: {
        addressDetail: spotDetail?.location.addressDetail!,
        address: spotDetail?.location.address!,
        dong: spotDetail?.name!,
        zipCode: spotDetail?.location.zipCode!,
      },
      main: false,
      availableTime: pickUpTime,
      spaceType: spotDetail?.type,
    };

    if(isDelivery){
      // 장바구니 o , 배송 정보에서 넘어온 경우
      dispatch(SET_USER_DESTINATION_STATUS('spot'));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart/delivery-info', query: { destinationId: spotDetail?.id } });
    }else{
      // 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
      dispatch(SET_USER_DESTINATION_STATUS('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push('/cart');  
    }
  };

  useEffect(()=> {
    const spotLikeData = async() => {
      try{
        const { data } = await getSpotLike(spotDetail!.id);
        setSpotLike(data.data.liked)
      }catch(err){
        console.error(err);
      };
    };
  
    spotLikeData();
  }, [spotDetail, spotDetail?.id, spotLike]);

  const hanlderLike = async () => {
    if(!spotLike){
      try {
        const { data } = await postSpotLike(spotDetail!.id);
        if(data.code === 200 ){
          dispatch(SET_SPOT_LIKED(true));
          setSpotLike(true);
        }
      }catch(err){
        console.error(err);
      };
    }else if(spotLike){
      try{
        const { data } = await deleteSpotLike(spotDetail!.id);
        if(data.code === 200){
          dispatch(SET_SPOT_LIKED(false));
          setSpotLike(false);
        }
      }catch(err){
        console.error(err);
      };
    };
  };

  return (
    <Container>
      <Wrapper>
        <LikeWrapper>
          <LikeBtn onClick={hanlderLike}>
            <SVGIcon name={spotDetail?.liked ? 'likeRed' : 'likeBlack'} />
          </LikeBtn>
          <TextH5B color={theme.white} padding="0 0 0 4px">
            {spotDetail?.likeCount}
          </TextH5B>
        </LikeWrapper>
        <Col />
        <BtnWrapper onClick={goToCart}>
          <TextH5B color={theme.white}>
              주문하기
          </TextH5B>
        </BtnWrapper>
      </Wrapper>
      {
        spotDetail?.discountRate !== 0 && (
          <TootipWrapper>
            <TimerTooltip message={`${spotDetail?.discountRate}% 할인 중`} bgColor={theme.brandColor} color={theme.white} minWidth='78px' />
          </TootipWrapper>
        )
      }
    </Container>
  );
}

const Container = styled.section`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: ${({ theme }) => theme.black};

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const Wrapper = styled.div`
  padding: 16px 24px;
  display: flex;
  width: 100%;
`;

const TootipWrapper = styled.article`
  position: absolute;
  top: -18%;
  right: 51%;
`;

const LikeWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
`;

const Col = styled.div`
  width: 1px;
  height: 24px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${({ theme }) => theme.white};
`;

const BtnWrapper = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;
`;

const LikeBtn = styled.div`
  cursor: pointer;
`;

export default SpotDetailBottom;
