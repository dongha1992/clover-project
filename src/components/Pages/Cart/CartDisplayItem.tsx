import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { FlexBetween, FlexRow, theme, FlexRowStart } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import Checkbox from '@components/Shared/Checkbox';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
import { IGetCart } from '@model/index';
import isNil from 'lodash-es/isNil';

interface IProps {
  handleSelectCartItem: (menu: IGetCart) => void;
  checkedMenus: IGetCart[];
  removeCartDisplayItemHandler: (menu: IGetCart) => void;
  menu: IGetCart;
}

const CartDisplayItem = ({ checkedMenus, handleSelectCartItem, removeCartDisplayItemHandler, menu }: IProps) => {
  const isSelected = !isNil(checkedMenus.find((item) => item.menuId === menu.menuId));

  return (
    <Container>
      <Wrapper>
        <FlexRowStart width="40%">
          <CheckboxWrapper>
            <Checkbox onChange={() => handleSelectCartItem(menu)} isSelected={isSelected} />
          </CheckboxWrapper>
          <ImageWrapper>
            <Image
              src={IMAGE_S3_URL + menu.image.url}
              alt="상품이미지"
              width={'100%'}
              height={'100%'}
              layout="responsive"
              className="rounded"
            />
          </ImageWrapper>
        </FlexRowStart>
        <FlexBetween>
          <TextB2R margin="0 0 0 8px">{menu.menuName}</TextB2R>
          <RemoveBtnContainer onClick={() => removeCartDisplayItemHandler && removeCartDisplayItemHandler(menu)}>
            <SVGIcon name="defaultCancel" />
          </RemoveBtnContainer>
        </FlexBetween>
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
  margin-bottom: 16px;
`;

const CheckboxWrapper = styled.div`
  margin-right: 8px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  .rounded {
    border-radius: 8px;
  }
`;

const RemoveBtnContainer = styled.div`
  /* position: absolute;
  right: 12px;
  top: 12px; */
`;

export default React.memo(CartDisplayItem);
