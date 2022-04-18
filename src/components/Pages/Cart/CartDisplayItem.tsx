import React from 'react';
import styled from 'styled-components';
import { TextB3R } from '@components/Shared/Text';
import { FlexBetween, FlexRow, theme, FlexRowStart } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import Checkbox from '@components/Shared/Checkbox';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
interface IProps {
  handleSelectCartItem: (id: number) => void;
  checkedMenuIdList: number[];
  removeCartDisplayItemHandler: (id: number) => void;
  menu: any;
}

const CartDisplayItem = ({ checkedMenuIdList, handleSelectCartItem, removeCartDisplayItemHandler, menu }: IProps) => {
  return (
    <Container>
      <Wrapper>
        <FlexRowStart width="40%">
          <CheckboxWrapper>
            <Checkbox
              onChange={() => handleSelectCartItem(menu.menuId)}
              isSelected={checkedMenuIdList.includes(menu.id)}
            />
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
          <TextB3R>{menu.menuName}</TextB3R>
          <RemoveBtnContainer onClick={() => removeCartDisplayItemHandler && removeCartDisplayItemHandler(menu.id)}>
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
  margin-bottom: 8px;
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
`;

const RemoveBtnContainer = styled.div`
  /* position: absolute;
  right: 12px;
  top: 12px; */
`;

export default React.memo(CartDisplayItem);
