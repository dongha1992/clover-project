import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { IMAGE_S3_URL } from '@constants/mock/index';
import { ISpotsDetail } from '@model/index';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';
import { SVGIcon } from '@utils/common';

interface IParams {
  item: ISpotsDetail;
}

// 스팟 검색 - 추천 스팟
const SpotRecommendList = ({ item }: IParams): ReactElement => {
  const { userLocation, userDeliveryType } = useSelector(destinationForm);
  const router = useRouter();
  const { isSubscription, subsDeliveryType } = router.query;

  const userLocationLen = !!userLocation.emdNm?.length;

  const typeTag = (): string | null => {
    const type = item?.type;
    switch (type) {
      case 'PRIVATE':
        return '프라이빗';
      case 'PUBLIC':
        return '퍼블릭';
      default:
        return null;
    }
  };

  const goToSpotsDetail = (id: number | undefined): void => {
    if(item.isClosed) {
      return;
    };
    if (userDeliveryType === 'spot') {
      if (isSubscription) {
        router.push({
          pathname: `/spot/detail/${id}`,
          query: { isDelivery: true, isSubscription, subsDeliveryType },
        });
      } else {
        router.push({
          pathname: `/spot/detail/${id}`,
          query: { isDelivery: true },
        });
      }
    } else {
      if (isSubscription) {
        router.push({
          pathname: `/spot/detail/${id}`,
          query: { isDelivery: true, isSubscription, subsDeliveryType },
        });
      } else {
        router.push(`/spot/detail/${id}`);
      }
    }
  };

  const pickUpTime = `${item.lunchDeliveryStartTime}-${item.lunchDeliveryEndTime} / ${item.dinnerDeliveryStartTime}-${item.dinnerDeliveryEndTime}`;

  return (
    <Container onClick={() => goToSpotsDetail(item.id)}>
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{`${item.location.address} ${item.location.addressDetail}`}</TextB3R>
        {
          item.isClosed ? (
            <MeterAndTime>
              <SVGIcon name='exclamationMark' width='14' height='14' />
              <TextB3R color={theme.brandColor} padding='0 0 0 2px'>운영 종료된 프코스팟이에요</TextB3R>
            </MeterAndTime>
          ) : !item?.closedDate ? (
            <MeterAndTime>
              {userLocationLen && (
                <>
                  <TextH6B color={theme.greyScale65}>{`${Math.round(item.distance)}m`}</TextH6B>
                  <Col />
                </>
              )}
              <TextH6B color={theme.greyScale65}>픽업&nbsp;</TextH6B>
              <TextH6B color={theme.greyScale65}>{pickUpTime}</TextH6B>
            </MeterAndTime>
          ) : (
            <MeterAndTime>
              <SVGIcon name='exclamationMark' width='14' height='14' />
              <TextB3R color={theme.brandColor} padding='0 0 0 2px'>운영 종료 예정인 프코스팟이에요</TextB3R>
            </MeterAndTime>
          )
        }
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
      </FlexColStart>
      <FlexCol>
        <ImageWrapper>
          <SpotImg src={`${IMAGE_S3_URL}${item.images[0].url}`} />
        </ImageWrapper>
      </FlexCol>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 114px;
  margin-bottom: 24px;
  cursor: pointer;
`;

const MeterAndTime = styled.div`
  display: flex;
  margin: 8px 0 16px 0;
`;

const ImageWrapper = styled.div`
  width: 80px;
  padding-left: 15px;
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

export default SpotRecommendList;
