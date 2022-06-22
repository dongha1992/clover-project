import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexColEnd, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/common/getMediaQuery';
import { IMAGE_S3_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import { ISpotsDetail } from '@model/index';
import { useRouter } from 'next/router';
import { cartForm } from '@store/cart';
import { userForm } from '@store/user';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_SPOT } from '@store/mypage';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { SET_ALERT } from '@store/alert';
import { spotSelector } from '@store/spot';

interface IProps {
    item: ISpotsDetail | any;
  }
  
const SpotSearchMapList = ({item}: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDelivery, orderId, isSubscription, subsDeliveryType } = router.query;
  const { cartLists } = useSelector(cartForm);
  const { isLoginSuccess } = useSelector(userForm);
  const { userLocation } = useSelector(destinationForm);
  const { spotSearchArr } = useSelector(spotSelector);
  const spotList = spotSearchArr&&spotSearchArr;

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
        <TagWrapper>
          {!item.isTrial ? (
            <div>
              <Tag backgroundColor={theme.brandColor5P} color={theme.brandColor}>
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
          { !!item.discountRate && 
            <div>
                <Tag backgroundColor={theme.brandColor5P} color={theme.brandColor} margin='0 0 0 5px'>
                  {`${item.discountRate}% 할인중`}
                </Tag>
            </div>
          }
        </TagWrapper>
      </FlexColStart>
      <FlexColEnd>
        <ImageWrapper mapList>
          {item?.images?.map((i: { url: string }, idx: number) => {
            return <SpotImg key={idx} src={`${IMAGE_S3_URL}${i.url}`} />;
          })}
        </ImageWrapper>
        <Button backgroundColor={theme.white} color={theme.black} width="75px" height="38px" border onClick={()=>{}}>
          주문하기
        </Button>
      </FlexColEnd>
    </Container>
  );
};

const Container = styled.section<{ mapList: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 145px;
  margin-bottom: 24px;
  padding: 16px;
  ${({ mapList }) => {
    if (mapList) {
      return css`
        background: ${theme.white};
        max-width: ${breakpoints.desktop}px;
        max-width: ${breakpoints.mobile}px;
        height: 160px;
        border-radius: 8px;
        padding: 20px;
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

const TagWrapper = styled.div`
  display: flex;
`;

const SpotImg = styled.img`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${theme.greyScale6};
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 4px;
`;


export default SpotSearchMapList;
