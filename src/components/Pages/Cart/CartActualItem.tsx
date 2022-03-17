import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexBetween, theme, FlexCol, FlexBetweenStart } from '@styles/theme';
import CountButton from '@components/Shared/Button/CountButton';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Shared/Tag';
import InfoMessage from '@components/Shared/Message';

interface IProps {
  menu: any;
  removeCartActualItemHandler: ({ id, main }: { id: number; main: boolean }) => void;
  clickPlusButton: (id: number, quantity: number) => void;
  clickMinusButton: (id: number, quantity: number) => void;
  clickRestockNoti: any;
}

const CartActualItem = ({
  menu,
  removeCartActualItemHandler,
  clickPlusButton,
  clickMinusButton,
  clickRestockNoti,
}: IProps) => {
  return (
    <Container isSoldout={menu.isSoldout}>
      <ContentWrapper>
        <FlexBetween>
          <TextB3R>{!menu.main ? `[선택옵션] ${menu.name}` : menu.name}</TextB3R>
          <div
            onClick={() => removeCartActualItemHandler && removeCartActualItemHandler({ id: menu.id, main: menu.main })}
          >
            <SVGIcon name="defaultCancel" />
          </div>
        </FlexBetween>
        <FlexCol>
          <PriceWrapper>
            <TextH5B color={menu.isSoldout ? theme.greyScale25 : theme.brandColor} padding={'0 4px 0 0'}>
              {menu.discount}%
            </TextH5B>
            <TextH5B>{menu.price}원</TextH5B>
          </PriceWrapper>
          <FlexBetweenStart>
            <InfoMessage status={menu.isSoldout ? 'soldOut' : 'soldSoon'} count={2} />
            <CountButtonContainer>
              {menu.isSoldout ? (
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
          </FlexBetweenStart>
        </FlexCol>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div<{ isSoldout?: boolean }>`
  display: flex;
  color: ${({ isSoldout }) => isSoldout && theme.greyScale25};
  background-color: ${theme.greyScale3};
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  position: relative;
`;

const ContentWrapper = styled.div`
  margin-left: 8px;
  width: 100%;
  height: 70px;
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const CountButtonContainer = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

export default React.memo(CartActualItem);
