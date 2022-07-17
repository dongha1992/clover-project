import { FlexBetween, FlexCol, FlexColStart, FlexRow, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextB3R } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import SVGIcon from '@utils/common/SVGIcon';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import getCustomDate from '@utils/destination/getCustomDate';
import { getDisplayMenuName } from '@utils/menu';
import dayjs from 'dayjs';
import { IWillWriteReview } from '@model/index';
import { DELIVERY_TIME_MAP, DELIVERY_TYPE_MAP } from '@constants/order';
import { DeliveryTag } from '@components/Shared/Tag';
import { IMAGE_S3_URL } from '@constants/mock';
import { IMAGE_ERROR } from '@constants/menu';
interface IProps {
  review: IWillWriteReview;
}

const WillWriteReviewItem = ({ review }: IProps) => {
  const { dayFormatter: deliveryAt } = getCustomDate(new Date(review.deliveryDate));
  const writeReviewLimit = dayjs(review.deliveryDate).add(6, 'day').format('YYYY-MM-DD');
  const { dayFormatter: limitAt } = getCustomDate(new Date(writeReviewLimit));

  const isSpot = review.delivery === 'SPOT';
  const isSubscription = review.orderType === 'SUBSCRIPTION';

  const formatUrl = review.image.url.split('');
  const isError = formatUrl[0] !== '/';

  console.log(review, '--');
  return (
    <Container>
      <Wrapper>
        <FlexRow margin="0 0 8px 0">
          <TextH5B>배송완료</TextH5B>
          {isSubscription && <Tag margin="0 4px 0 8px">정기구독</Tag>}
          <DeliveryTag deliveryType={review?.delivery!} margin="0 4px" />
          {isSpot && (
            <Tag backgroundColor={theme.white} border={theme.brandColor} color={theme.brandColor}>
              {DELIVERY_TIME_MAP[review?.deliveryDetail!]}
            </Tag>
          )}
        </FlexRow>
        <FlexRow padding="0 0 8px 0">
          <SVGIcon name="deliveryTruckIcon" />
          <TextH5B padding="2px 0 0 4px">{deliveryAt} 도착</TextH5B>
        </FlexRow>
        <FlexRow padding="0 0 16px 0">
          <ImageWrapper>
            <ItemImage src={isError ? IMAGE_ERROR : IMAGE_S3_URL + review.image.url} alt="상품이미지" />
          </ImageWrapper>
          <FlexColStart width="70%" margin="0 0 0 16px">
            <TextB2R padding="0 0 4px 0">{review.displayMenuName}</TextB2R>
            <FlexRow>
              <TextB3R color={theme.greyScale65}>{limitAt} 까지 작성 가능</TextB3R>
            </FlexRow>
          </FlexColStart>
        </FlexRow>
        <FlexRow>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="0 8px 0 0"
            onClick={() =>
              router.push(
                `/mypage/review/write/${review.orderDeliveryId}?menuId=${review.menuId}&menuDetailId=${review.menuDetailId}`
              )
            }
          >
            후기 작성하기
          </Button>
        </FlexRow>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  width: 75px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default WillWriteReviewItem;
