import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B } from '@components/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import Tag from '@components/Tag';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import { SET_CART_SHEET_OBJ } from '@store/cart';
import CartSheetGroup from '@components/CartSheet/CartSheetGroup';
import { useRouter } from 'next/router';

type TProps = {
  item: any;
};

function Item({ item }: TProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const goToCartSheet = (e: any) => {
    e.stopPropagation();
    /* TODO: thunk로? */
    dispatch(SET_CART_SHEET_OBJ(item));
    dispatch(
      setBottomSheet({
        content: <CartSheetGroup />,
        buttonTitle: '장바구니에 담기',
      })
    );
  };

  const goToDetail = (id: number) => {
    router.push(`/menu/${id}`);
  };
  return (
    <Container onClick={() => goToDetail(item.id)}>
      <ImageWrapper>
        <ItemImage src={item.url} alt="상품이미지" />
        <CartBtn onClick={goToCartSheet}>
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
          <Tag key={index}>{tag}</Tag>
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
  right: 8px;
  bottom: 12px;
  border-radius: 50%;
  background-color: white;
  width: 32px;
  height: 32px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.2);
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
