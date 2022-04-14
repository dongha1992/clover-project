import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/getMediaQuery';
import { IMAGE_S3_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import { ISpotsDetail } from '@model/index';
import { useRouter } from 'next/router';
import { cartForm } from '@store/cart';
import { userForm } from '@store/user';
import { destinationForm, SET_USER_DESTINATION_STATUS, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_DESTINATION, SET_TEMP_EDIT_SPOT } from '@store/mypage';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { SET_ALERT } from '@store/alert';

interface IProps {
  item: ISpotsDetail | any;
};
// 스팟 검색 - 검색 결과

const SpotsSearchResultList = ({ item }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDelivery, orderId, isSubscription, deliveryInfo }: any = router.query;
  const { cartLists } = useSelector(cartForm);
  const { isLoginSuccess } = useSelector(userForm);
  const { userLocation } = useSelector(destinationForm);

  const userLocationLen = !!userLocation.emdNm?.length;
  const pickUpTime = `${item.lunchDeliveryStartTime}-${item.lunchDeliveryEndTime} / ${item.dinnerDeliveryStartTime}-${item.dinnerDeliveryEndTime}`;

  const typeTag = (): string => {
    switch (item.type) {
      case 'PRIVATE':
        return '프라이빗';
      case 'PUBLIC':
        return '퍼블릭';
      default:
        return '퍼블릭';
    }
  };

  const orderHandler = () => {
    const destinationInfo = {
      name: item.name,
      location: {
        addressDetail: item.location.addressDetail,
        address: item.location.address,
        dong: item.location.dong,
        zipCode: item.location.zipCode,
      },
      main: false,
      availableTime : pickUpTime,
      spaceType: item.type,
      spotPickupId: item.spotPickup?.id,
    };

    const goToCart = () =>{
      // 로그인 o, 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
      dispatch(SET_USER_DESTINATION_STATUS('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push('/cart');
    };

    const goToDeliveryInfo = () => {
      // 장바구니 o, 배송 정보에서 픽업장소 변경하기 위헤 넘어온 경우
      dispatch(SET_USER_DESTINATION_STATUS('spot'));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart/delivery-info', query: { destinationId: item?.id } });
    };

    const goToSelectMenu = () => {
      // 로그인o and 장바구니 x, 메뉴 검색으로 이동
      dispatch(SET_USER_DESTINATION_STATUS('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));  
      router.push('/search');
    };

    const handleSbsDeliveryInfo = () => {
      dispatch(SET_USER_DESTINATION_STATUS(deliveryInfo));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: item?.id, isSubscription, deliveryInfo },
      });
    };

    const handleSbsDeliveryInfoWithSpot = () => {
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      dispatch(SET_USER_DESTINATION_STATUS(deliveryInfo));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: item?.id, isSubscription, deliveryInfo },
      });
    };

    if (isLoginSuccess) {
      if (orderId) {
        dispatch(
          SET_TEMP_EDIT_SPOT({
            spotPickupId: item.pickups[0].id,
            name: item.name,
            spotPickup: item.pickups[0].name,
          })
        );
        router.push({
          pathname: '/mypage/order-detail/edit/[orderId]',
          query: { orderId },
        });
        return;
      }

      if (cartLists.length) {
        // 로그인o and 장바구니 o
        if (isDelivery) {
          // 장바구니 o, 배송 정보에서 넘어온 경우
          if (isSubscription) {
            // 구독에서 넘어옴
            dispatch(SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={handleSbsDeliveryInfo} />,
            }));
          } else {
            // 장바구니 o , 배송 정보에서 넘어온 경우
            dispatch(SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={goToDeliveryInfo} />,
            }));
          }
        } else {
          // 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
          dispatch(SET_BOTTOM_SHEET({
            content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={goToCart} />,
          }));
        }
      } else {
        // 로그인o and 장바구니 x
        if (isSubscription) {
          // 구독에서 넘어옴
          dispatch(SET_BOTTOM_SHEET({
            content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={handleSbsDeliveryInfoWithSpot} />,
          }));
        } else {
          // 로그인o and 장바구니 x, 메뉴 검색으로 이동
          dispatch(SET_BOTTOM_SHEET({
            content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={goToSelectMenu} />,
          }));
        }
      }
    } else {
      // 로그인x, 로그인 이동
      dispatch(SET_ALERT({
        alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
        submitBtnText: '확인',
        closeBtnText: '취소',
        onSubmit: () => router.push('/onboarding'),
      }))
    }
  };

  return (
    <Container mapList>
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item.location.address}</TextB3R>
        <MeterAndTime>
          {userLocationLen && (
            <>
              <TextH6B>{`${Math.round(item.distance)}m`}</TextH6B>
              <Col />
            </>
          )}
          <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
            픽업
          </TextH6B>
          <TextH6B color={theme.greyScale65}>{pickUpTime}</TextH6B>
        </MeterAndTime>
        <div>
          <Tag backgroundColor={theme.brandColor5P} color={theme.brandColor}>
            {typeTag()}
          </Tag>
        </div>
      </FlexColStart>
      <FlexCol>
        <ImageWrapper mapList>
          {
            item?.images?.map((i: { url: string; }, idx: number) => {
              return (
                <SpotImg key={idx} src={`${IMAGE_S3_URL}${i.url}`} />
              )
            })
          }
        </ImageWrapper>
        <Button backgroundColor={theme.white} color={theme.black} height="38px" border onClick={orderHandler}>
          주문하기
        </Button>
      </FlexCol>
    </Container>
  );
};

const Container = styled.section<{ mapList: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 114px;
  margin-bottom: 24px;
  ${({ mapList }) => {
    if (mapList) {
      return css`
        background: ${theme.white};
        max-width: ${breakpoints.desktop}px;
        max-width: ${breakpoints.mobile}px;
        height: 146px;
        border-radius: 8px;
      `;
    }
  }}
`;

const MeterAndTime = styled.div`
  display: flex;
  margin: 8px 0 16px 0;
`;

const ImageWrapper = styled.div<{ mapList: boolean }>`
  width: 70px;
  margin-left: 15px;
  border-radius: 8px;
  ${({ mapList }) => {
    if (mapList) {
      return css`
        margin-bottom: 10px;
      `;
    }
  }}
`;

const SpotImg = styled.img`
  width: 100%;
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 4px;
`;
export default React.memo(SpotsSearchResultList);
