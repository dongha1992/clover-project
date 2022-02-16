import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { theme, FlexCol, showMoreText } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Shared/Tag';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import { SET_CART_SHEET_OBJ } from '@store/cart';
import { CartSheet } from '@components/BottomSheet/CartSheet';
import { useRouter } from 'next/router';

type TProps = {
  item: any;
  isQuick?: boolean;
};

const isNew = true;

const Item = ({ item, isQuick = false }: TProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const goToCartSheet = (e: any) => {
    e.stopPropagation();
    /* TODO: thunk로? */
    dispatch(SET_CART_SHEET_OBJ(item));
    dispatch(
      setBottomSheet({
        content: <CartSheet />,
      })
    );
  };

  const goToDetail = (menuId: number) => {
    router.push(`/menu/${menuId}`);
  };
  return (
    <Container onClick={() => goToDetail(item.id)}>
      <ImageWrapper>
        <ItemImage src={item.url} alt="상품이미지" />
        <CartBtn onClick={goToCartSheet}>
          <SVGIcon name="cart" />
        </CartBtn>
        {isNew && (
          <NewTagWrapper>
            <TextH6B color={theme.white}>New</TextH6B>
          </NewTagWrapper>
        )}
      </ImageWrapper>
      <FlexCol>
        <NameWrapper>
          <TextB3R margin="8px 0 0 0" width="100%" textHide>
            {item.name}
          </TextB3R>
        </NameWrapper>
        <PriceWrapper>
          <TextH5B color={theme.brandColor} padding="0 4px 0 0">
            {item.discount}%
          </TextH5B>
          <TextH5B>{item.price}원</TextH5B>
        </PriceWrapper>
        <TextB3R color={theme.greyScale65}>{item.description}</TextB3R>
        {!isQuick && (
          <>
            <LikeAndReview>
              <Like>
                <SVGIcon name="like" />
                <TextB3R>{item.like}</TextB3R>
              </Like>
              <TextB3R>리뷰 {item.review}</TextB3R>
            </LikeAndReview>
            <TagWrapper>
              {item.tags.map((tag: string, index: number) => {
                if (index > 1) return;
                return (
                  <Tag key={index} margin="0px 8px 8px 0px">
                    {tag}
                  </Tag>
                );
              })}
            </TagWrapper>
          </>
        )}
      </FlexCol>
    </Container>
  );
};

const Container = styled.div`
  max-width: 220px;
  width: 48%;
  height: auto;
  background-color: #fff;
  margin-bottom: 10px;
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

const NewTagWrapper = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  top: 10%;
  background-color: ${theme.brandColor};
  padding: 4px 8px;
`;

const NameWrapper = styled.div`
  height: 26px;
  width: 100%;
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
