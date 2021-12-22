import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { theme, FlexCol, showMoreText } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import Tag from '@components/Shared/Tag';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import { SET_CART_SHEET_OBJ } from '@store/cart';
import CartSheetGroup from '@components/BottomSheet/CartSheet/CartSheetGroup';
import { useRouter } from 'next/router';

/* TODO: Tag 부분 css 다시 & Height 조정 필요 */
/* TODO: 이름 나오는 부분 한줄, 두줄 */

type TProps = {
  item: any;
  isCart?: boolean;
};

const isNew = true;

function Item({ item, isCart }: TProps) {
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
        {!isCart && (
          <TextB3R color={theme.greyScale65}>{item.description}</TextB3R>
        )}
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
      </FlexCol>
    </Container>
  );
}

const Container = styled.div`
  max-width: 220px;
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
  width: 155px;
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
