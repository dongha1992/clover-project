import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexColStart, textH6 } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ISpotsDetail, ISpotPickupInfoInDestination } from '@model/index';
import { useRouter } from 'next/router';
import { userForm } from '@store/user';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_SPOT } from '@store/mypage';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { SET_ALERT } from '@store/alert';
import { spotSelector } from '@store/spot';
import { dateN, SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { getSpotDistanceUnit } from '@utils/spot';
import { postDestinationApi } from '@api/destination';
import { weeks } from '@constants/delivery-info';
import { dayOfWeek } from '@utils/common/getFormatDate';
import useSubsSpotOpenCheck from '@hooks/subscription/useSubsSpotOpenCheck';
import Image from '@components/Shared/Image';
import NextImage from 'next/image';

interface IProps {
  item: ISpotsDetail | any;
  hasCart?: boolean;
  map?: boolean;
  recommand?: boolean;
  dragging?: boolean;
}
const now = dayjs();

// 스팟 검색 - 검색 결과
// 추천 스팟, 스팟 검색 결과, 스팟 검색 결과 지도뷰 리스트
const SpotsSearchResultList = ({ item, hasCart, map, recommand, dragging, }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isDelivery,
    orderId,
    destinationId,
    isSubscription,
    subsDeliveryType,
    menuId,
    deliveryDate,
    lastDeliveryDate,
    pickupDays,
  }: any = router.query;
  const store = useStore();
  const { isLoginSuccess } = useSelector(userForm);
  const { userLocation, userTempDestination, applyAll } = useSelector(destinationForm);
  const { spotPickupId, spotsPosition } = useSelector(spotSelector);
  const [isSubs, setIsSubs] = useState<boolean>();
  const [isLocker, setIsLocker] = useState<boolean>();

  const userLocationLen = !!userLocation.emdNm?.length;
  const positionLen = spotsPosition?.latitude !== null;
  const pickUpTime = `${item.lunchDeliveryStartTime}-${item.lunchDeliveryEndTime} / ${item.dinnerDeliveryStartTime}-${item.dinnerDeliveryEndTime}`;

  // 운영 종료 예정 or 종료
  const closedDate = item?.closedDate;
  const dDay = now.diff(dayjs(closedDate), 'day');
  const closedOperation = dDay > 0 || item?.isClosed;
  const closedSoonOperation = dDay >= -14;

  useEffect(() => {
    if (router.isReady) {
      if (router.query.isSubscription === 'true') {
        const IsSubs = router.query.isSubscription === 'true';
        setIsSubs(IsSubs);
      }
    }
  }, [router.isReady, router.query.isSubscription]);

  useEffect(() => {
    item.pickups.forEach((p: any) => {
      if (p.type === 'PICKUP') {
        setIsLocker(false);
        return;
      } else {
        setIsLocker(true);
      }
    });
  }, []);

  const isSubsSpot = useSubsSpotOpenCheck({
    placeOpenDays: item?.placeOpenDays! ?? null,
    pickupDaysArr: JSON.parse(decodeURIComponent(pickupDays ?? null)),
    dayOfWeek: dayOfWeek(deliveryDate) ?? null,
    isAll: applyAll ?? null,
  });

  const renderSpotMsg = () => {
    switch (true) {
      case closedOperation: {
        return (
          <MeterAndTime>
            <SVGIcon name="exclamationMark" width="14" height="14" />
            <TextB3R color={theme.brandColor} padding="0 0 0 2px">
              운영 종료된 프코스팟이에요
            </TextB3R>
          </MeterAndTime>
        );
      }
      case closedSoonOperation: {
        if (closedDate) {
          return (
            <MeterAndTime>
              <SVGIcon name="exclamationMark" width="14" height="14" />
              <TextB3R color={theme.brandColor} padding="0 0 0 2px">
                운영 종료 예정인 프코스팟이에요
              </TextB3R>
            </MeterAndTime>
          );
        }
      }
      default: {
        return (
          <MeterAndTime>
            {(userLocationLen || positionLen) && (
              <>
                <TextH6B color={theme.greyScale65}>{`${getSpotDistanceUnit(item.distance).distance}${
                  getSpotDistanceUnit(item.distance).unit
                }`}</TextH6B>
                <Col />
              </>
            )}
            <TextPickup>픽업</TextPickup>
            <TextH6B color={theme.greyScale65}>{pickUpTime}</TextH6B>
          </MeterAndTime>
        );
      }
    }
  };

  // 스팟 주문하기 - 스팟 검색 결과 리스트, 지도뷰 리스트 주문하기
  const orderHandler = (e: any) => {
    e.stopPropagation();

    const getDesticationInfo = async (pickupInfo: ISpotPickupInfoInDestination) => {
      // 로그인 o, 장바구니 o, 스팟 검색 내에서 장바구니(cart)로 넘어간 경우
      const reqBody = {
        name: item?.name!,
        delivery: 'SPOT',
        deliveryMessage: '',
        main: false,
        receiverName: '',
        receiverTel: '',
        location: {
          addressDetail: item?.location?.addressDetail!,
          address: item?.location?.address!,
          zipCode: item?.location?.zipCode!,
          dong: item?.location?.dong!,
        },
        spotPickupId: pickupInfo.id,
      };
      try {
        const { data } = await postDestinationApi(reqBody); // 배송지 id 값을 위해 api 호출
        if (data.code === 200) {
          const response = data.data;
          const destinationId = response.id;
          if (orderId) { // 마이페이지 - 배송정보 - 스팟 배송지 변경인 경우
            dispatch(
              SET_TEMP_EDIT_SPOT({
                spotPickupId: pickupInfo.id,
                name: item.name,
                spotPickup: pickupInfo.name,
              })
            );
            router.push({
              pathname: '/mypage/order-detail/edit/[orderId]',
              query: { orderId, destinationId },
            });  
          } else {
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
                spotId: item.id,
                availableTime: pickUpTime,
              })
            );
            dispatch(SET_USER_DELIVERY_TYPE('spot'));
            router.push({
              pathname: '/cart',
              query: { isClosed: !!closedDate },
            });  
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const goToDeliveryInfo = (pickupInfo: ISpotPickupInfoInDestination) => {
      const deliveryInfoDestinationInfo = {
        id: item.id,
        name: item.name,
        location: {
          addressDetail: item.location.addressDetail,
          address: item.location.address,
          dong: item.location.dong,
          zipCode: item.location.zipCode,
        },
        main: false,
        availableTime: pickUpTime,
        spaceType: item.type,
        spotPickupId: pickupInfo.id!,
        closedDate: item.closedDate,
        delivery: 'SPOT',
      };

      // 장바구니 o, 배송 정보에서 픽업장소 변경하기(스팟검색)로 넘어온 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_TEMP_DESTINATION(deliveryInfoDestinationInfo));
      // CHECK_LIST : destinationId 쿼리 지워야 하는지 체크
      router.push({ pathname: '/cart/delivery-info', query: { isClosed: !!closedDate } });
    };

    const handleSubsDeliveryType = (pickupInfo: ISpotPickupInfoInDestination) => {
      const subsDestinationInfo = {
        id: item.id,
        name: item.name,
        location: {
          addressDetail: item.location.addressDetail,
          address: item.location.address,
          dong: item.location.dong,
          zipCode: item.location.zipCode,
        },
        main: false,
        availableTime: pickUpTime,
        spaceType: item.type,
        spotPickupId: pickupInfo.id!,
        closedDate: item.closedDate,
        delivery: 'SPOT',
      };
      dispatch(SET_TEMP_DESTINATION(subsDestinationInfo));
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));

      router.push({
        pathname: '/cart/delivery-info',
        query: { isSubscription, subsDeliveryType, menuId },
      });
    };

    if (!item.isOpened) {
      // 스찻 오픈 예정인 상태 - 주문 불가
      return;
    }
    if (item.isClosed) {
      // 스팟 종료된 상태 - 주문 불가ㅇ
      return;
    }
    if (isLoginSuccess) {
      //로그인 o
      if (orderId) { // 마이페이지 - 배송정보 - 스팟 배송지 변경일 경우
        if (
          closedDate &&
          ((applyAll && dateN(lastDeliveryDate) > dateN(closedDate)) ||
            (!applyAll && dateN(deliveryDate) > dateN(closedDate)))
        ) {
          dispatch(
            SET_ALERT({
              alertMessage: `운영 종료 예정인 프코스팟으로는\n변경할 수 없어요.`,
              submitBtnText: '확인',
              onSubmit: () => {},
            })
          );
        } else if (!isSubsSpot && isSubs) {
          dispatch(
            SET_ALERT({
              alertMessage: `현재 구독의 배송 일정과 운영일이\n일치하지 않아 변경할 수 없어요.`,
              submitBtnText: '확인',
              onSubmit: () => {},
            })
          );
        } else {        
          <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={getDesticationInfo} />
        };
      };
      if (hasCart) {
        // 로그인o and 장바구니 o
        if (isDelivery) {
          // 장바구니 o, 배송 정보에서 넘어온 경우
          if (isSubscription) {
            // 구독에서 넘어옴
            if (!!closedDate) {
              // 종료 예정인 스팟 - 정기구독 주문 불가 팝업
              dispatch(
                SET_ALERT({
                  alertMessage: `운영 종료 예정된 프코스팟은\n구독을 이용할 수 없어요!`,
                  submitBtnText: '확인',
                  onSubmit: () => {},
                })
              );
            } else {
              dispatch(
                SET_BOTTOM_SHEET({
                  content: (
                    <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={handleSubsDeliveryType} />
                  ),
                })
              );
            }
          } else {
            // 장바구니 o , 배송 정보에서 넘어온 경우
            dispatch(
              SET_BOTTOM_SHEET({
                content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={goToDeliveryInfo} />,
              })
            );
          }
        } else {
          // 장바구니 o, 스팟 검색에서 cart로 이동
          dispatch(
            SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={getDesticationInfo} />,
            })
          );
        }
      } else {
        // 로그인o and 장바구니 x
        if (isSubscription) {
          // 구독에서 넘어옴
          if (!!item.closedDate) {
            // 종료 예정인 스팟 - 정기구독 주문 불가 팝업
            dispatch(
              SET_ALERT({
                alertMessage: `운영 종료 예정된 프코스팟은\n구독을 이용할 수 없어요!`,
                submitBtnText: '확인',
                onSubmit: () => {},
              })
            );
          } else {
            dispatch(
              SET_BOTTOM_SHEET({
                content: (
                  <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={handleSubsDeliveryType} />
                ),
              })
            );
          }
        } else {
          // 로그인o and 장바구니 x, cart로 이동
          dispatch(
            SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={getDesticationInfo} />,
            })
          );
        }
      }
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

  const goToDetail = useCallback((id: number | undefined, e: React.SyntheticEvent) => {
    if (dragging) {
      e.stopPropagation();
      return;
    };

    if (
      orderId &&
      closedDate &&
      ((applyAll && dateN(lastDeliveryDate) > dateN(closedDate)) ||
        (!applyAll && dateN(deliveryDate) > dateN(closedDate)))
    ) {
      dispatch(
        SET_ALERT({
          alertMessage: `운영 종료 예정인 프코스팟으로는\n변경할 수 없어요.`,
          submitBtnText: '확인',
          onSubmit: () => {},
        })
      );
    } else if (orderId && !isSubsSpot && isSubs) {
      dispatch(
        SET_ALERT({
          alertMessage: `현재 구독의 배송 일정과 운영일이\n일치하지 않아 변경할 수 없어요.`,
          submitBtnText: '확인',
          onSubmit: () => {},
        })
      );
    } else {
      if (isDelivery && !isSubs) {
        router.push({
          pathname: `/spot/detail/${id}`,
          query: {
            isSpot: true,
            isDelivery: true,
          },
        });
      } else if (isDelivery && isSubs) {
        router.push({
          pathname: `/spot/detail/${id}`,
          query: { isSpot: true, destinationId: item?.id, isSubscription, isDelivery: true, subsDeliveryType, menuId },
        });
      } else {
        router.push({
          pathname: `/spot/detail/${id}`,
          query: {
            isSpot: true,
            orderId,
            destinationId,
          },
        });
      };
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  return (
    <Container
      map={map}
      onClick={(e) => {
        isSubs && (item.isTrial || isLocker) ? null : goToDetail(item.id, e);
      }}
    >
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item?.location?.address}</TextB3R>
        {renderSpotMsg()}
        <TagWrapper>
          {!item.isClosed && (
            <>
              {item?.isTrial ? (
                <Tag margin="0 5px 0 0" backgroundColor={theme.greyScale6} color={theme.greyScale45}>
                  트라이얼
                </Tag>
              ) : item?.type === 'PRIVATE' ? (
                <Tag margin="0 5px 0 0" backgroundColor={theme.brandColor5P} color={theme.brandColor}>
                  프라이빗
                </Tag>
              ) : null}
              {item?.discountRate! > 0 && !isSubs && (
                <Tag
                  margin="0 5px 0 0"
                  backgroundColor={theme.brandColor5P}
                  color={theme.brandColor}
                >{`${item?.discountRate}% 할인 중`}</Tag>
              )}
            </>
          )}
          {!item.isOpened && (
            <Tag backgroundColor={theme.brandColor5P} color={theme.brandColor}>
              오픈예정
            </Tag>
          )}
        </TagWrapper>
      </FlexColStart>
      <FlexCol>
        <ImageWrapper>
          {item.isTrial || item.images?.length! < 0 ? (
            <NextImage 
              src='/images/img_fcospot_empty.png'
              alt="트라이얼 프코스팟 인 경우 또는 등록된 이미지가 없는 경우의 이미지"
              width={60}
              height={60}
              layout="responsive"
            />
          ) : (
            <Image 
              src={item?.images[0].url} 
              height={60}
              width={60}
              alt="프코스팟 매장이미지"
              className='fcospot-img'
              layout="responsive"
            />
          )}
        </ImageWrapper>
        {!recommand &&
          (item.isOpened && !item.isClosed ? (
            // 오픈예정 or 종료된스팟 둘중 하나라도 false하면 주문하기 disabled
            isSubs && (item.isTrial || isLocker) ? (
              <Button
                backgroundColor={theme.white}
                width="75px"
                height="38px"
                disabled
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                주문하기
              </Button>
            ) : (
              <Button
                backgroundColor={theme.white}
                color={theme.black}
                width="75px"
                height="38px"
                border
                onClick={(e) => orderHandler(e)}
              >
                주문하기
              </Button>
            )
          ) : (
            <Button
              backgroundColor={theme.white}
              width="75px"
              height="38px"
              disabled
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              주문하기
            </Button>
          ))}
      </FlexCol>
    </Container>
  );
};

const Container = styled.section<{ map?: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: ${theme.white};
  max-width: ${breakpoints.desktop}px;
  max-width: ${breakpoints.mobile}px;
  cursor: pointer;
  ${({ map }) => {
    if (map) {
      return css`
        margin-bottom: 10px;
        padding: 16px;
        filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
        height: 160px;
        border-radius: 8px;
        padding: 20px;
      `;
    } else {
      return css`
        padding: 12px 0;
      `;
    }
  }}
`;

const MeterAndTime = styled.div`
  display: flex;
  padding: 8px 0 10px 0;
`;

const TagWrapper = styled.div``;

const ImageWrapper = styled.div<{ map?: boolean }>`
  width: 60px;
  margin-left: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid ${theme.greyScale6};  
  .fcospot-img{
    width: 100%;
    border-radius: 8px;
  }
  ${({ map }) => {
    if (map) {
      return css`
        width: 70px;
      `;
    } else {
      return css`
        width: 60px;
      `;
    }
  }}
`;

const SpotImg = styled.img`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${theme.greyScale6};
`;

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 4px;
`;

const TextPickup = styled.div`
  width: 26px;
  ${textH6};
  padding: 0 4px 0 0;
  color: ${theme.greyScale65};
`;

export default React.memo(SpotsSearchResultList);
