import React, { ReactElement, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH6B, TextB2R, TextH4B, TextH5B, TextH7B } from '@components/Shared/Text';
import { theme, FlexCol, FlexRow } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { userForm } from '@store/user';
import { useToast } from '@hooks/useToast';
import { ISpotsDetail, ISpotPickupInfoInDestination } from '@model/index';
import { getSpotLike, postSpotRegistrationsRecruiting } from '@api/spot';
import { cartForm } from '@store/cart';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_DESTINATION, SET_TEMP_DESTINATION } from '@store/destination';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { useOnLike } from 'src/queries';
import { spotSelector } from '@store/spot';
import { getSpotDistanceUnit } from '@utils/spot';
import { Button } from '@components/Shared/Button';
import { postDestinationApi } from '@api/destination';
import Image from '@components/Shared/Image';
import NextImage from 'next/image';

// spot list type은 세가지가 있다.
// 1. normal 2. event 3. trial

interface IProps {
  list: ISpotsDetail;
  type: string;
}

const SpotList = ({ list, type }: IProps): ReactElement => {
  const { id } = list;
  const routers = useRouter();
  const dispatch = useDispatch();
  const { isDelivery, orderId } = routers.query;
  const { isLoginSuccess } = useSelector(userForm);
  const { cartLists } = useSelector(cartForm);
  const { userLocation, userTempDestination } = useSelector(destinationForm);
  const { spotPickupId } = useSelector(spotSelector);
  const { showToast, hideToast } = useToast();

  const userLocationLen = !!userLocation.emdNm?.length;
  const pickUpTime = `${list.lunchDeliveryStartTime}-${list.lunchDeliveryEndTime} / ${list.dinnerDeliveryStartTime}-${list.dinnerDeliveryEndTime}`;

  const goToDetail = (): void => {
    router.push({
      pathname: `/spot/detail/${id}`,
      query: { isSpot: true },
    });
  };

  // 스팟 주문하기 - 이벤트 스팟 주문하기
  const orderHandler = (e: any): void => {
    e.stopPropagation();
    const destinationInfo = {
      name: list.name,
      location: {
        addressDetail: list.location.addressDetail,
        address: list.location.address,
        dong: list.name,
        zipCode: list.location.zipCode,
      },
      main: false,
      availableTime: pickUpTime,
      spaceType: list.type,
      spotPickupId: spotPickupId!,
    };

    const goToCart = async (pickupInfo: ISpotPickupInfoInDestination) => {
      // 로그인 o, 장바구니 o, 스팟 검색 내에서 장바구니(cart)로 넘어간 경우
      const reqBody = {
        name: list?.name!,
        delivery: 'SPOT',
        deliveryMessage: '',
        main: false,
        receiverName: '',
        receiverTel: '',
        location: {
          addressDetail: list?.location?.addressDetail!,
          address: list?.location?.address!,
          zipCode: list?.location?.zipCode!,
          dong: list?.location?.dong!,
        },
        spotPickupId: pickupInfo.id!,
      };
      try {
        const { data } = await postDestinationApi(reqBody); // 배송지 id 값을 위해 api 호출
        if (data.code === 200) {
          const response = data.data;
          const destinationId = response.id;
          dispatch(
            SET_DESTINATION({
              name: response.name,
              location: {
                addressDetail: response.location.addressDetail,
                address: response.location.address,
                dong: response.location.dong,
                zipCode: response.location.zipCode,
              },
              main: response.main,
              deliveryMessage: response.deliveryMessage,
              receiverName: response.receiverName,
              receiverTel: response.receiverTel,
              deliveryMessageType: '',
              delivery: response.delivery,
              id: destinationId,
              spotId: list.id,
              availableTime: pickUpTime,
            })
          );
          dispatch(SET_USER_DELIVERY_TYPE('spot'));
          router.push({ pathname: '/cart', query: { isClosed: !!list.closedDate } });
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (isLoginSuccess) {
      // 로그인o
      if (orderId) {
        // 배송정보 변경에서 넘어온 경우
        dispatch(SET_TEMP_DESTINATION(destinationInfo));
        router.push({
          pathname: '/mypage/order-detail/edit/[orderId]',
          query: { orderId },
        });
        return;
      }
      dispatch(
        // 로그인 o, 장바구니 o, 이벤트 스팟 - 주문하기 클릭  cart로 이동
        SET_BOTTOM_SHEET({
          content: <PickupSheet pickupInfo={list?.pickups} spotType={list?.type} onSubmit={goToCart} />,
        })
      );
    } else {
      // 로그인x, 로그인 이동
      dispatch(
        SET_ALERT({
          alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => router.push('/onboarding'),
        })
      );
    }
  };

  const onClickLike = (e: any) => {
    e.stopPropagation();
    if (isLoginSuccess) {
      // 로그인 체크
      onLike();
    } else {
      dispatch(
        SET_ALERT({
          alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => router.push('/onboarding'),
        })
      );
    }
  };

  const onLike = useOnLike(list.id!, list.liked);

  const clickSpotJoin = async (id: number) => {
    if (list.recruited) {
      return;
    }
    const TitleMsg = `프코스팟 오픈에 참여하시겠습니까?\n오픈 시 알려드릴게요!`;
    dispatch(
      SET_ALERT({
        alertMessage: TitleMsg,
        onSubmit: () => joinPublicSpotRecruiting(id),
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
  };

  const joinPublicSpotRecruiting = async (id: number) => {
    try {
      const { data } = await postSpotRegistrationsRecruiting(id);
      if (data.code === 200) {
        router.push({
          pathname: `/mypage/spot-status/detail/${id}`,
          query: { recruited: true },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const SpotsListTypeRender = () => {
    switch (type) {
      // 오늘 점심, 신규, 역세권 스팟
      case 'normal':
        return (
          <Container type="normal">
            <StorImgWrapper onClick={goToDetail}>
              <Tag>
                <SVGIcon name="whitePeople" />
                <TextH7B padding="2px 2px 0 2px" color={theme.white}>{`${list?.userCount}명 이용중`}</TextH7B>
              </Tag>
              <ImageWrapper>
                {list.isTrial || list.images.length < 0  ? (
                  <NextImage 
                    src='/images/img_fcospot_empty.png'
                    alt="프코스팟 매장이미지"
                    width={132}
                    height={132}
                  />
                ) : (
                  <Image 
                    src={list.images[0].url}
                    alt="프코스팟 매장이미지"
                    width={132}
                    height={132}
                    className='fcospot-img'
                  />
                )}
              </ImageWrapper>
            </StorImgWrapper>
            <LocationInfoWrapper type="normal">
              <TextB2R margin="8px 0 0 0" color={theme.black}>
                {list?.name}
              </TextB2R>
              {
                // 유저 위치정보 있을때 노출
                userLocationLen && (
                  <TextH6B color={theme.greyScale65}>
                    {`${getSpotDistanceUnit(list?.distance).distance}${getSpotDistanceUnit(list?.distance).unit}`}
                  </TextH6B>
                )
              }
              <LikeWrapper type="normal" onClick={(e) => onClickLike(e)}>
                <SVGIcon name={list.liked ? 'likeRed18' : 'likeBorderGray'} />
                <TextB3R padding="4px 0 0 1px">{list?.likeCount}</TextB3R>
              </LikeWrapper>
            </LocationInfoWrapper>
          </Container>
        );
      //이벤트 스팟
      case 'event':
        return (
          <Container type="event" onClick={goToDetail}>
            <StorImgWrapper>
              <LikeWrapper type="event" onClick={(e) => onClickLike(e)}>
                <SVGIcon name={list.liked ? 'likeRed' : 'whiteHeart24'} />
              </LikeWrapper>
              <ImageWrapper>
                {list.isTrial || list.images.length < 0  ? (
                  <NextImage 
                    src='/images/img_fcospot_empty.png'
                    alt="프코스팟 매장이미지"
                    width={132}
                    height={132}
                  />
                ) : (
                  <Image 
                    src={list.images[0].url}
                    alt="프코스팟 매장이미지"
                    width={132}
                    height={132}
                    className='fcospot-img'
                  />
                )}
              </ImageWrapper>
            </StorImgWrapper>
            <LocationInfoWrapper type="event">
              <div>
                <TextH4B>{list?.eventTitle}</TextH4B>
                <TextH6B margin="8px 0 0 0" color={theme.greyScale65}>
                  {list?.name}
                </TextH6B>
              </div>
              <ButtonWrapper>
                {
                  // 유저 위치정보 있을때 노출
                  userLocationLen && (
                    <TextH6B color={theme.greyScale65}>
                      {`${getSpotDistanceUnit(list?.distance).distance}${getSpotDistanceUnit(list?.distance).unit}`}
                    </TextH6B>
                  )
                }
                <Button
                  backgroundColor={theme.white}
                  color={theme.black}
                  width="75px"
                  height="38px"
                  border
                  onClick={orderHandler}
                >
                  주문하기
                </Button>
              </ButtonWrapper>
            </LocationInfoWrapper>
          </Container>
        );
      // 오픈 진행중인 스팟 (단골가게)
      case 'trial':
        return (
          <Container type="trial">
            <LocationInfoWrapper type="trial">
              <FlexCol>
                <TextH5B margin="0 0 4px 0">{list.placeName}</TextH5B>
                <TextB3R margin="0 0 4px 0">{`${list.location?.address} ${list.location?.addressDetail}`}</TextB3R>
                {
                  // 유저 위치정보 있을때 노출
                  userLocationLen && (
                    <TextH6B margin="0 0 8px 0" color={theme.greyScale65}>
                      {`${getSpotDistanceUnit(list?.distance).distance}${getSpotDistanceUnit(list?.distance).unit}`}
                    </TextH6B>
                  )
                }
                <FlexRow margin="0 0 16px 0">
                  <SVGIcon name="people" />
                  <TextH6B
                    padding="4px 0 0 2px"
                    color={theme.brandColor}
                  >{`${list.recruitingCount}/100명 참여중`}</TextH6B>
                </FlexRow>
                {!list.recruited ? (
                  <Button
                    backgroundColor={theme.white}
                    color={theme.black}
                    width="75px"
                    height="38px"
                    border
                    onClick={() => clickSpotJoin(list.id!)}
                  >
                    참여하기
                  </Button>
                ) : (
                  <Button backgroundColor={theme.white} width="75px" height="38px" disabled>
                    참여완료
                  </Button>
                )}
              </FlexCol>
            </LocationInfoWrapper>
          </Container>
        );
      default:
        return null;
    }
  };
  return <>{SpotsListTypeRender()}</>;
};

const Container = styled.section<{ type: string }>`
  margin-right: 16px;
  ${({ type }) => {
    if (type === 'event') {
      return css`
        display: inline-flex;
        position: relative;
        bottom: 0;
        width: 299px;
        margin-bottom: 48px;
        border-radius: 8px;
        justify-content: space-between;
        cursor: pointer;
      `;
    } else if (type === 'normal') {
      return css`
        width: 120px;
      `;
    } else if (type === 'trial') {
      return css`
        min-width: 220px;
        min-height: 174px;
        display: inline-block;
        padding: 24px;
        border: 1px solid ${theme.greyScale6};
        border-radius: 8px;
      `;
    }
  }}
`;

const StorImgWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(36, 36, 36, 0.9);
  border-radius: 4px;
  padding: 4px 8px;
  opacity: 90%;
`;

const ImageWrapper = styled.div`
  width: 132px;
  heigth: 132px;  
  .fcospot-img {
    width: 100%;
    border: 1px solid ${theme.greyScale6};
    border-radius: 8px;
  }
`;

const LocationInfoWrapper = styled.div<{ type: string }>`
  ${({ type }) => {
    if (type === 'event') {
      return css`
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 16px;
      `;
    } else if (type === 'trial') {
      return `
        display: flex;
        justify-content;
        align-items: center;
        justify-content: space-between;
            `;
    } else {
      return `
        margin-top: 8px;
            `;
    }
  }}
`;

const LikeWrapper = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  ${({ type }) => {
    if (type === 'event') {
      return css`
        position: absolute;
        right: 8px;
        top: 8px;
      `;
    }
  }}
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-right: 7px;
`;

export default SpotList;
