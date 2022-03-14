import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import CountButton from '@components/Shared/Button/CountButton';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Shared/Tag';
import Checkbox from '@components/Shared/Checkbox';

interface IProps {
  handleSelectCartItem: any;
  checkedMenuIdList: any;
  removeCartDisplayItemHandler: any;
  menu: any;
}

const CartDisplayItem = ({ checkedMenuIdList, handleSelectCartItem, removeCartDisplayItemHandler, menu }: IProps) => {
  return (
    <Container>
      <Checkbox onChange={() => handleSelectCartItem(menu.id)} isSelected={checkedMenuIdList.includes(menu.id)} />
      <Wrapper>
        <ImageWrapper>
          <ItemImage src={menu.url} alt="상품이미지" />
        </ImageWrapper>
        <ContentWrapper>
          <TextB3R>{menu.name}</TextB3R>
          <FlexBetween>
            <RemoveBtnContainer onClick={() => removeCartDisplayItemHandler && removeCartDisplayItemHandler(menu.id)}>
              <SVGIcon name="defaultCancel" />
            </RemoveBtnContainer>
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
  background-color: ${theme.white};
  border-radius: 8px;
  margin-bottom: 8px;
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

const RemoveBtnContainer = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default React.memo(CartDisplayItem);
