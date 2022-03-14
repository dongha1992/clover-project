import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import CountButton from '@components/Shared/Button/CountButton';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Shared/Tag';
import InfoMessage from '@components/Shared/Message';

interface IProps {
  menu: any;
  removeCartItemHandler: any;
  clickPlusButton: any;
  clickMinusButton: any;
  clickRestockNoti: any;
}

const CartActualItem = ({
  menu,
  removeCartItemHandler,
  clickPlusButton,
  clickMinusButton,
  clickRestockNoti,
}: IProps) => {
  const isSoldout = false;
  return (
    <Container isSoldout={isSoldout}>
      <ContentWrapper>
        <TextB3R>{menu.name}</TextB3R>
        <FlexBetween>
          <PriceWrapper>
            <TextH5B color={isSoldout ? theme.greyScale25 : theme.brandColor} padding={'0 4px 0 0'}>
              {menu.discount}%
            </TextH5B>
            <TextH5B>{menu.price}원</TextH5B>
          </PriceWrapper>
          <RemoveBtnContainer onClick={() => removeCartItemHandler && removeCartItemHandler(menu.id)}>
            <SVGIcon name="defaultCancel" />
          </RemoveBtnContainer>
          <CountButtonContainer>
            {isSoldout ? (
              <Tag backgroundColor={theme.black} padding="6px 10px" borderRadius={32} onClick={clickRestockNoti}>
                <TextH6B color={theme.white}>재입고 알림</TextH6B>
              </Tag>
            ) : (
              <CountButton
                id={menu.id}
                quantity={menu.quantity}
                clickPlusButton={clickPlusButton}
                clickMinusButton={clickMinusButton}
              />
            )}
          </CountButtonContainer>
        </FlexBetween>
      </ContentWrapper>
      <div className="itemInfo">
        <InfoMessage status="soldSoon" count={2} />
      </div>
    </Container>
  );
};

const Container = styled.div<{ isSoldout?: boolean }>`
  display: flex;
  color: ${({ isSoldout }) => isSoldout && theme.greyScale25};
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

const RemoveBtnContainer = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const CountButtonContainer = styled.div`
  margin-top: 10px;
`;

export default React.memo(CartActualItem);
