import React, { memo } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R, TextB2R } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { getDiscountPrice } from '@utils/menu/getMenuDisplayPrice';
import { getFormatPrice } from '@utils/common';
import Image from '@components/Shared/Image';
interface IProps {
  menu: any;
  isDeliveryComplete?: boolean;
  isCanceled?: boolean;
  canReview?: boolean;
  goToReivew?: () => void;
}

const OrderItem = ({ menu, isDeliveryComplete, isCanceled, goToReivew, canReview }: IProps) => {
  const { discountedPrice, discount } = getDiscountPrice({
    discountPrice: menu.menuDiscount,
    price: menu.menuPrice,
  });

  return (
    <Container isCanceled={isCanceled}>
      <Wrapper>
        <ImageWrapper>
          <Image
            src={menu.image.url}
            alt="상품이미지"
            width={'100%'}
            height={'100%'}
            layout="responsive"
            className="rounded"
          />
        </ImageWrapper>
        <ContentWrapper>
          <TextB3R>
            {menu.menuName} / {menu.menuDetailName}
          </TextB3R>
          <FlexBetween>
            <PriceWrapper>
              {discount > 0 && (
                <TextH5B
                  color={isCanceled ? theme.greyScale26 : theme.brandColor}
                  padding={'0 4px 0 0'}
                  className="percent"
                >
                  {discount}%
                </TextH5B>
              )}
              <TextH5B>{getFormatPrice(String(discountedPrice))}원</TextH5B>
              <Col />
              <TextB2R>{menu.menuQuantity}개</TextB2R>
            </PriceWrapper>
            {isDeliveryComplete && canReview ? (
              <div>
                <Button
                  backgroundColor={theme.white}
                  color={theme.black}
                  border
                  height="38px"
                  padding="10px 16px"
                  onClick={goToReivew}
                >
                  후기 작성
                </Button>
              </div>
            ) : null}
          </FlexBetween>
        </ContentWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{ isCanceled?: boolean }>`
  position: relative;
  width: 100%;
  background-color: ${theme.white};
  border-radius: 8px;
  margin-bottom: 16px;
  color: ${({ isCanceled }) => isCanceled && theme.greyScale25};
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
`;

const ImageWrapper = styled.div`
  width: 75px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70px;
  margin-left: 8px;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  margin-top: 2px;
`;

const Col = styled.div`
  display: flex;
  width: 1px;
  height: 16px;
  background-color: ${theme.greyScale6};
  justify-content: center;
  align-items: center;
  margin: 2px 8px;
`;
export default React.memo(OrderItem);
