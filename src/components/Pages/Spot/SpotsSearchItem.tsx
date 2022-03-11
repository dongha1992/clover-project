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
import { destinationForm, SET_USER_DESTINATION_STATUS, SET_TEMP_DESTINATION } from '@store/destination';

interface IProps {
  item: ISpotsDetail;
  onClick: () => void;
  mapList?: boolean;
}

// 스팟 검색 - 최근픽업이력 & 검색 결과
const SpotsSearchItem = ({ item, onClick, mapList }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDelivery } = router.query;
  const { cartLists } = useSelector(cartForm);
  const { isLoginSuccess} = useSelector(userForm);
  const { userLocation } = useSelector(destinationForm);
  
  const userLocationLen = !!userLocation.emdNm?.length;

  const pickUpTime = `${item.lunchDeliveryStartTime}-${item.lunchDeliveryEndTime} / ${item.dinnerDeliveryStartTime}-${item.dinnerDeliveryEndTime}`;

  const typeTag = (): string => {
    const type = item.type;
    switch (type) {
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
      name: item.name,
      location: {
        addressDetail: item.location.addressDetail,
        address: item.location.address,
        dong: item.name,
        zipCode: item.location.zipCode,
      },
      main: false,
      availableTime: pickUpTime,
      spaceType: item.type,
    };
    
    if(isLoginSuccess){
      if(cartLists.length) {
        // 로그인o and 장바구니 o
        if(isDelivery){
          // 장바구니 o, 배송 정보에서 넘어온 경우
          dispatch(SET_USER_DESTINATION_STATUS('spot'));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          router.push({ pathname: '/cart/delivery-info', query: { destinationId: item.id } });
        }else{
          // 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
          dispatch(SET_USER_DESTINATION_STATUS('spot'));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));  
          router.push('/cart');  
        }
      }else{
        // 로그인o and 장바구니 x
        router.push('/search');
      }
    }else{
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
          {
            userLocationLen &&
            <>
              <TextH6B>{`${Math.round(item.distance)}m`}</TextH6B>
              <Col />
            </>
          }
          <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
            픽업
          </TextH6B>
          <TextH6B color={theme.greyScale65}>{pickUpTime}</TextH6B>
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
          <SpotImg src={`${IMAGE_S3_URL}${item.images[0].url}`} />
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
