import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { FlexBetween, FlexRow, theme, FlexRowStart, FlexCol } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import Checkbox from '@components/Shared/Checkbox';
import Image from '@components/Shared/Image';
import { IGetCart } from '@model/index';
import isNil from 'lodash-es/isNil';
import InfoMessage from '@components/Shared/Message';

interface IProps {
  selectCartItemHandler: (menu: IGetCart) => void;
  checkedMenus: IGetCart[];
  removeCartDisplayItemHandler: (menu: IGetCart) => void;
  menu: IGetCart;
}

const CartDisplayItem = ({ checkedMenus, selectCartItemHandler, removeCartDisplayItemHandler, menu }: IProps) => {
  const isSelected = !isNil(checkedMenus?.find((item) => item.menuId === menu.menuId));

  const isDisabled = menu.isSold;

  return (
    <Container>
      <Wrapper>
        <FlexRowStart>
          <CheckboxWrapper>
            <Checkbox
              onChange={() => {
                if (isDisabled) {
                  return;
                }
                selectCartItemHandler(menu);
              }}
              isSelected={isSelected}
              disabled={isDisabled}
            />
          </CheckboxWrapper>
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
        </FlexRowStart>
        <FlexBetween>
          <FlexCol margin="0 0 0 8px">
            <TextB2R color={isDisabled ? theme.greyScale25 : ''}>{menu.name}</TextB2R>
            {isDisabled && <InfoMessage message={'품절된 상품이에요'} />}
          </FlexCol>
          <RemoveBtnContainer onClick={() => removeCartDisplayItemHandler && removeCartDisplayItemHandler(menu)}>
            <SVGIcon name="defaultCancel" />
          </RemoveBtnContainer>
        </FlexBetween>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{
  isCart?: boolean;
  padding?: string;
}>`
  position: relative;
  width: 100%;
  height: 100%;
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
  width: 60px;
  .rounded {
    border-radius: 8px;
  }
`;

const RemoveBtnContainer = styled.div``;

export default React.memo(CartDisplayItem);
