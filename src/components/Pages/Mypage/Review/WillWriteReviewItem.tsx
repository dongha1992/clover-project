import { FlexColStart, FlexRow, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextB3R } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import SVGIcon from '@utils/common/SVGIcon';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import { IWillWriteReview } from '@model/index';
import { DELIVERY_TIME_MAP } from '@constants/order';
import { DeliveryTag } from '@components/Shared/Tag';
import { IMAGE_S3_URL } from '@constants/mock';
import { IMAGE_ERROR } from '@constants/menu';
import { getLimitDateOfReview } from '@utils/menu';
interface IProps {
  review: IWillWriteReview;
}

const WillWriteReviewItem = ({ review }: IProps) => {
  const { limitAt, deliveryAt, isAvailable } = getLimitDateOfReview(review.deliveryDate);

  const isSpot = review.delivery === 'SPOT';
  const isSubscription = review.orderType === 'SUBSCRIPTION';

  const formatUrl = review.image.url.split('');
  const isError = formatUrl[0] !== '/';

  return (
    <Container>
      <Wrapper>
        <FlexRow margin="0 0 8px 0">
          <TextH5B>배송완료</TextH5B>
          {isSubscription && (
            <Tag margin="0 4px 0 8px" backgroundColor={theme.brandColor5P} color={theme.brandColor}>
              {review.tag}
            </Tag>
          )}
          <DeliveryTag deliveryType={review?.delivery!} margin="0 4px" />
          {isSpot && (
            <Tag backgroundColor={theme.white} border={theme.brandColor} color={theme.brandColor}>
              {DELIVERY_TIME_MAP[review?.deliveryDetail!]}
            </Tag>
          )}
        </FlexRow>
        <FlexRow padding="0 0 8px 0">
          {review.orderType === 'SUBSCRIPTION' ? <SVGIcon name="subscription" /> : <SVGIcon name="deliveryTruckIcon" />}
          <TextH5B padding="2px 0 0 4px">
            {review.orderType === 'SUBSCRIPTION' && `배송 ${review.deliveryRound}회차 - `}
            {deliveryAt} 도착
          </TextH5B>
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
                `/mypage/review/write/${review.orderDeliveryId}?menuId=${review.menuId}&menuDetailId=${review.menuDetailId}&orderType=${review.orderType}&deliveryRound=${review.deliveryRound}`
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

const Container = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid ${theme.greyScale6};
  &:last-of-type {
    border-bottom: none;
  }
`;

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
