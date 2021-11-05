import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B } from '@components/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Tag';

type TProps = {
  item: any;
};

function Item({ item }: TProps) {
  return (
    <Container>
      <ImageWrapper>
        <ItemImage src={item.url} alt="상품이미지" />
        <CartBtn>
          <SVGIcon name="cart" />
        </CartBtn>
      </ImageWrapper>

      <TextB3R margin="8px 0 0 0">{item.name}</TextB3R>
      <PriceWrapper>
        <TextH5B color={theme.brandColor} padding={'0 4px 0 0'}>
          {item.discount}%
        </TextH5B>
        <TextH5B>{item.price}원</TextH5B>
      </PriceWrapper>
      <TextB3R color={theme.greyScale65}>{item.description}</TextB3R>
      <LikeAndReview>
        <Like>
          <SVGIcon name="like" />
          <TextB3R>{item.like}</TextB3R>
        </Like>
        <TextB3R>리뷰 {item.review}</TextB3R>
      </LikeAndReview>
      <TagWrapper>
        {item.tags.map((tag: string, index: number) => (
          <Tag children={tag} key={index} />
        ))}
      </TagWrapper>
    </Container>
  );
}

const Container = styled.div`
  max-width: 220px;
  height: auto;
  background-color: #fff;
  margin-bottom: 24px;
  display: inline-block;
  flex-direction: column;
  align-items: flex-start;
`;

const CartBtn = styled.div`
  position: absolute;
  right: 3%;
  bottom: 3%;
  border-radius: 50%;
  background-color: white;
  width: 32px;
  height: 32px;
  > svg {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 100%;
    width: 16px;
    height: 16px;
  }
`;
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const LikeAndReview = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0px;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
`;

const TagWrapper = styled.div`
  white-space: wrap;
`;

export default Item;
