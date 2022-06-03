import React, { memo } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R, TextB2R } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import { IMAGE_S3_URL } from '@constants/mock';

interface IProps {
  menu: any;
  getTotalPrice: () => void;
}

const FinishOrderItem = ({ menu, getTotalPrice }: IProps) => {
  const menuImg = menu.orderDeliveries[0].orderMenus[0].image.url;

  return (
    <Container>
      <Wrapper>
        <ImageWrapper>
          <ItemImage src={IMAGE_S3_URL + menuImg} alt="상품이미지" />
        </ImageWrapper>
        <ContentWrapper>
          <TextB3R>{menu.name}</TextB3R>
          <FlexBetween>
            <PriceWrapper>
              <TextH5B>{getTotalPrice()}원</TextH5B>
            </PriceWrapper>
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
  /* height: 70px; */
  margin-left: 8px;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  margin-top: 2px;
`;

export default React.memo(FinishOrderItem);
