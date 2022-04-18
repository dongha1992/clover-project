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
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_TEMP_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_DESTINATION, SET_TEMP_EDIT_SPOT } from '@store/mypage';

interface IProps {
  item: ISpotsDetail | any;
  onClick: () => void;
  mapList?: boolean;
}

// 스팟 검색 - 최근픽업이력 & 검색 결과

/* TODO: 최근 픽업 이력과 검색 결과 item에 데이터 형이 다름 */

const SpotsSearchItem = ({ item, onClick, mapList }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDelivery, orderId, isSubscription, deliveryInfo }: any = router.query;
  const { cartLists } = useSelector(cartForm);
  const { isLoginSuccess } = useSelector(userForm);
  const { userLocation } = useSelector(destinationForm);

  const userLocationLen = !!userLocation.emdNm?.length;

  const pickUpTime = `${item.lunchDeliveryStartTime}-${item.lunchDeliveryEndTime} / ${item.dinnerDeliveryStartTime}-${item.dinnerDeliveryEndTime}`;
  const recentPickupTime = `${item.spotPickup?.spot.lunchDeliveryStartTime}-${item.spotPickup?.spot.lunchDeliveryEndTime} / ${item.spotPickup?.spot.dinnerDeliveryStartTime}-${item.spotPickup?.spot.dinnerDeliveryEndTime}`;
  const spaceType = item.type ? item.type : item.spotPickup.spot.type;
  const availableTime = item.spotPickup ? recentPickupTime : pickUpTime;

  /* TODO: 임시로 이렇게 해둠 */
  const imageUrl = item?.images ? item?.images[0]?.url : item?.spotPickup?.spot?.images[0].url;

  const typeTag = (): string => {
    switch (spaceType) {
      case 'PRIVATE':
        return '프라이빗';
      case 'PUBLIC':
        return '퍼블릭';
      default:
        return '';
    }
  };

  const orderHandler = () => {
    /* NOTICE: destinationInfo의 인터페이스가 서버 response임 */
    const destinationInfo = {
      name: item.name,
      location: {
        addressDetail: item.location.addressDetail,
        address: item.location.address,
        dong: item.location.dong,
        zipCode: item.location.zipCode,
      },
      main: false,
      availableTime,
      spaceType,
      spotPickupId: item.spotPickup?.id,
    };

    // TODO : destinationId 리덕스로 수정?
    if (isLoginSuccess) {
      if (orderId) {
        dispatch(
          SET_TEMP_EDIT_SPOT({
            spotPickupId: item.pickups ? item.pickups[0].id : item.spotPickup.id,
            name: item.name,
            spotPickup: item.pickups ? item.pickups[0].name : item.spotPickup.name,
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
          dispatch(SET_TEMP_DESTINATION(destinationInfo));

          if (isSubscription) {
            dispatch(SET_USER_DELIVERY_TYPE(deliveryInfo));
            router.push({
              pathname: '/cart/delivery-info',
              query: { destinationId: item.id, isSubscription, deliveryInfo },
            });
          } else {
            dispatch(SET_USER_DELIVERY_TYPE('spot'));
            router.push({ pathname: '/cart/delivery-info', query: { destinationId: item.id } });
          }
        } else {
          // 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
          dispatch(SET_USER_DELIVERY_TYPE('spot'));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          router.push('/cart');
        }
      } else {
        // 로그인o and 장바구니 x
        if (isSubscription) {
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          dispatch(SET_USER_DELIVERY_TYPE(deliveryInfo));
          router.push({
            pathname: '/cart/delivery-info',
            query: { destinationId: item.id, isSubscription, deliveryInfo },
          });
        } else {
          router.push('/search');
        }
      }
    } else {
      // 로그인x
      router.push('/onboarding');
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
          <TextH6B color={theme.greyScale65}>{availableTime}</TextH6B>
        </MeterAndTime>
        {!item.isTrial ? (
          <div>
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              {typeTag()}
            </Tag>
          </div>
        ) : (
          <div>
            <Tag backgroundColor={theme.greyScale6} color={theme.greyScale45}>
              트라이얼
            </Tag>
          </div>
        )}
      </FlexColStart>
      <FlexCol>
        <ImageWrapper mapList>
          <SpotImg src={`${IMAGE_S3_URL}${imageUrl}`} />
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
export default React.memo(SpotsSearchItem);
