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
import { postSpotLike, deleteSpotLike, getSpotLike } from '@api/spot';
import { SET_SPOT_LIKED, INIT_SPOT_LIKED } from '@store/spot';
import { userForm } from '@store/user';
import { cartForm } from '@store/cart';
import { useDispatch } from 'react-redux';
import { SET_USER_DESTINATION_STATUS, SET_DESTINATION, SET_TEMP_DESTINATION } from '@store/destination';
import { SET_ALERT } from '@store/alert';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';


const SpotDetailBottom = () => {
  const dispatch = useDispatch();
  const { isDelivery } = router.query;
  const { isLoginSuccess } = useSelector(userForm);
  const { cartLists } = useSelector(cartForm);
  const { spotDetail, spotPickupPlace } = useSelector(spotSelector);
  const [spotLike, setSpotLike] = useState(spotDetail?.liked);
  const detailId: number = spotDetail!.id;

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
      spotPickup: spotPickupPlace,
    };

    if (isLoginSuccess) {
      //로그인 o
      if (cartLists.length) {
        // 장바구니 o
        if (isDelivery) {
          // 장바구니 o , 배송 정보에서 넘어온 경우
          if(spotDetail?.pickups.length! > 1) {
            // 스팟 핏업 장소 2개 이상인 경우
            dispatch(SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={spotDetail?.pickups} />
            }));

            dispatch(SET_USER_DESTINATION_STATUS('spot'));
            dispatch(SET_TEMP_DESTINATION(destinationInfo));
            router.push({ pathname: '/cart/delivery-info', query: { destinationId: spotDetail?.id } });  
          }else {
            dispatch(SET_USER_DESTINATION_STATUS('spot'));
            dispatch(SET_TEMP_DESTINATION(destinationInfo));
            router.push({ pathname: '/cart/delivery-info', query: { destinationId: spotDetail?.id } });  
          }
        } else {
          // 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
          if(spotDetail?.pickups.length! > 1) {
            dispatch(SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={spotDetail?.pickups} />
            }));  

            dispatch(SET_USER_DESTINATION_STATUS('spot'));
            dispatch(SET_DESTINATION(destinationInfo));
            dispatch(SET_TEMP_DESTINATION(destinationInfo));
            router.push('/cart');
          }else {
            dispatch(SET_USER_DESTINATION_STATUS('spot'));
            dispatch(SET_DESTINATION(destinationInfo));
            dispatch(SET_TEMP_DESTINATION(destinationInfo));
            router.push('/cart');  
          }
        }
      } else {
        // 장바구니 x
        if(spotDetail?.pickups.length! > 1) {
          dispatch(SET_BOTTOM_SHEET({
            content: <PickupSheet pickupInfo={spotDetail?.pickups} />
          }));
          
          dispatch(SET_USER_DESTINATION_STATUS('spot'));
          dispatch(SET_DESTINATION(destinationInfo));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          router.push('/search');
        }else{
          dispatch(SET_USER_DESTINATION_STATUS('spot'));
          dispatch(SET_DESTINATION(destinationInfo));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          router.push('/search');
        }
      }
    } else {
      // 로그인x
      router.push('/onboarding');
    }
  };

  useEffect(() => {
    const spotLikeData = async () => {
      try {
        const { data } = await getSpotLike(detailId);
        setSpotLike(data.data.liked);
        if(data.data.liked){
          dispatch(SET_SPOT_LIKED());
        }else{
          dispatch(INIT_SPOT_LIKED());
        }
      } catch (err) {
        console.error(err);
      }
    };

    spotLikeData();
  }, [spotDetail, spotDetail?.id, spotLike]);

  const hanlderLike = async() => {
    if (isLoginSuccess) {
      try {
        if(!spotLike) {
          const { data } = await postSpotLike(detailId);
          if(data.code === 200){
            dispatch(SET_SPOT_LIKED());
            setSpotLike(true);    
          }
        }else {
          const { data } = await deleteSpotLike(detailId);
          if(data.code === 200){
            dispatch(INIT_SPOT_LIKED());
            setSpotLike(false);      
          }
        }
      } catch(e){
        console.error(e);
      }
    } else {
      const TitleMsg = `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`;
      dispatch(SET_ALERT({
        alertMessage: TitleMsg,
        onSubmit: () => {
          router.push('/onboarding');
        },
        submitBtnText: '확인',
        closeBtnText: '취소',
      }))
    }
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
          <TextH5B color={theme.white}>주문하기</TextH5B>
        </BtnWrapper>
      </Wrapper>
      {spotDetail?.discountRate !== 0 && (
        <TootipWrapper>
          <TimerTooltip
            message={`${spotDetail?.discountRate}% 할인 중`}
            bgColor={theme.brandColor}
            color={theme.white}
            minWidth="78px"
          />
        </TootipWrapper>
      )}
    </Container>
  );
};

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
