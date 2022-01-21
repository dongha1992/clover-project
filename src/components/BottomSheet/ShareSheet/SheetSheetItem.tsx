import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';

interface IProps {
  menu: any;
}

const ShareSheetItem = ({ menu }: IProps) => {
  return (
    <Container>
      <Wrapper>
        <ImageWrapper>
          <ItemImage src={menu.url} alt="상품이미지" />
        </ImageWrapper>
        <ContentWrapper>
          <TextB3R>{menu.name}</TextB3R>
          <FlexBetween>
            <PriceWrapper>
              <TextH5B color={theme.brandColor} padding={'0 4px 0 0'}>
                {menu.discount}%
              </TextH5B>
              <TextH5B>{menu.price}원</TextH5B>
            </PriceWrapper>
          </FlexBetween>
        </ContentWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{
  isSoldout?: boolean;
  isCart?: boolean;
  padding?: string;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ isCart }) =>
    !isCart ? theme.greyScale3 : theme.white};
  border-radius: 8px;
  margin-bottom: 8px;
  color: ${({ isSoldout }) => isSoldout && theme.greyScale25};
  padding: 16px;
`;

const Wrapper = styled.div`
  display: flex;
`;

const ImageWrapper = styled.div`
  width: 75px;
`;

const ContentWrapper = styled.div`
  margin-left: 8px;
  width: 100%;
  height: 60px;
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default React.memo(ShareSheetItem);
