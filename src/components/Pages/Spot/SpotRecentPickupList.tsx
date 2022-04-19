import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/getMediaQuery';
import { IMAGE_S3_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import { IDestinationsResponse } from '@model/index';
import { useRouter } from 'next/router';
import { cartForm } from '@store/cart';
import { userForm } from '@store/user';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_DESTINATION, SET_TEMP_EDIT_SPOT } from '@store/mypage';
import { SET_ALERT } from '@store/alert';
import { spotSelector } from '@store/spot';

interface IProps {
  item: IDestinationsResponse | undefined;
}

// 스팟 검색 - 최근픽업이력
const SpotRecentPickupList = ({ item }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDelivery, orderId, isSubscription, subsDeliveryType }: any = router.query;
  const { cartLists } = useSelector(cartForm);
  const { isLoginSuccess } = useSelector(userForm);
  const { userLocation } = useSelector(destinationForm);
  const { spotPickupId } = useSelector(spotSelector);

  const userLocationLen = !!userLocation.emdNm?.length;
  const recentPickupTime = `${item?.spotPickup?.spot.lunchDeliveryStartTime}-${item?.spotPickup?.spot.lunchDeliveryEndTime} / ${item?.spotPickup?.spot.dinnerDeliveryStartTime}-${item?.spotPickup?.spot.dinnerDeliveryEndTime}`;

  const typeTag = (): string => {
    switch (item?.spotPickup?.spot.type) {
      case 'PRIVATE':
        return '프라이빗';
      case 'PUBLIC':
        return '퍼블릭';
      default:
        return '';
    }
  };

  const orderHandler = () => {
    const destinationInfo = {
      name: item?.name!,
      location: {
        addressDetail: item?.location?.addressDetail!,
        address: item?.location?.address!,
        dong: item?.location?.dong!,
        zipCode: item?.location?.zipCode!,
      },
      main: false,
      availableTime: recentPickupTime!,
      spaceType: item?.spotPickup?.spot.type!,
      spotPickupId: spotPickupId!,
    };

    if (isLoginSuccess) {
      if (orderId) {
        dispatch(
          SET_TEMP_EDIT_SPOT({
            spotPickupId: item?.spotPickup?.id!,
            name: item?.name!,
            spotPickup: item?.spotPickup?.name!,
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
            dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
            router.push({
              pathname: '/cart/delivery-info',
              query: { destinationId: item?.id, isSubscription, subsDeliveryType },
            });
          } else {
            // 장바구니 o , 배송 정보에서 넘어온 경우
            dispatch(SET_USER_DELIVERY_TYPE('spot'));
            dispatch(SET_TEMP_DESTINATION(destinationInfo));
            router.push({ pathname: '/cart/delivery-info', query: { destinationId: item?.id } });
          }
        } else {
          // 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
          dispatch(SET_USER_DELIVERY_TYPE('spot'));
          dispatch(SET_DESTINATION(destinationInfo));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          router.push('/cart');
        }
      } else {
        // 로그인o and 장바구니 x
        if (isSubscription) {
          // 구독에서 넘어옴
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
          router.push({
            pathname: '/cart/delivery-info',
            query: { destinationId: item?.id, isSubscription, subsDeliveryType },
          });    
        } else {
          // 로그인o and 장바구니 x, 메뉴 검색으로 이동
          dispatch(SET_USER_DELIVERY_TYPE('spot'));
          dispatch(SET_DESTINATION(destinationInfo));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          router.push('/search');    
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

  return (
    <Container mapList>
      <FlexColStart>
        <TextH5B>{item?.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item?.location?.address}</TextB3R>
        <MeterAndTime>
          {userLocationLen && (
            <>
              <TextH6B>{`${Math.round(item?.spotPickup?.spot.distance!)}m`}</TextH6B>
              <Col />
            </>
          )}
          <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
            픽업
          </TextH6B>
          <TextH6B color={theme.greyScale65}>{recentPickupTime}</TextH6B>
        </MeterAndTime>
        <div>
          <Tag backgroundColor={theme.brandColor5P} color={theme.brandColor}>
            {typeTag()}
          </Tag>
        </div>
      </FlexColStart>
      <FlexCol>
        <ImageWrapper mapList>
          {item?.spotPickup?.spot.images?.map((i: { url: string }, idx: number) => {
            return <SpotImg key={idx} src={`${IMAGE_S3_URL}${i.url}`} />;
          })}
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
  border: 1px solid ${theme.greyScale6};
  border-radius: 8px;
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 4px;
`;
export default React.memo(SpotRecentPickupList);
