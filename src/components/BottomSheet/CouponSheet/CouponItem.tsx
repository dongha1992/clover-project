import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  TextH3B,
  TextB3R,
  TextB2R,
  TextB4R,
  TextH7B,
} from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { breakpoints } from '@utils/getMediaQuery';
import { FlexRow } from '@styles/theme';

const CouponItem = ({ coupon, onClick }: any) => {
  const isRateDiscount = coupon.type === 'rate';
  const isMoreThenOneMenu = coupon.canUseMenu.length > 1;

  return (
    <Container isDownload={coupon.isDownload}>
      <Wrapper>
        <Content>
          <TextH3B color={theme.brandColor}>
            {isRateDiscount ? `${coupon.discount}%` : `${coupon.discount}원`}
          </TextH3B>
          <TextB2R>{coupon.name}</TextB2R>
          {coupon.deliveryMethod && (
            <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
              배송방법: {coupon.deliveryMethod}
            </TextB3R>
          )}
          {coupon.condition && <TextB3R>{coupon.condition}</TextB3R>}
          {coupon.canUseMenu && (
            <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
              사용가능 메뉴:
              {isMoreThenOneMenu ? '특정 상품 한정' : coupon.canUseMenu[0]}
            </TextB3R>
          )}
          {isShow &&
            coupon.canUseMenu.map((menu: any, index: number) => {
              return (
                <FlexRow key={index}>
                  <Dot />
                  <TextB4R color={theme.greyScale65}>{menu}</TextB4R>
                </FlexRow>
              );
            })}
          {isMoreThenOneMenu && (
            <TextH7B
              textDecoration="underline"
              onClick={() => setIsShow(!isShow)}
              color={theme.greyScale65}
              pointer
              padding="2px 0 8px 0"
            >
              {isShow ? '접기' : '더보기'}
            </TextH7B>
          )}
          <TextB3R color={theme.brandColor}>{coupon.expireDate}</TextB3R>
        </Content>
        <BtnGroup>
          <SVGIcon name="dotColumn" />
          {coupon.isDownload ? (
            <Complete>
              <SVGIcon name="couponDownloadComplete" />
            </Complete>
          ) : (
            <Incomplete onClick={onClick}>
              <SVGIcon name="couponDownloadAvailable" />
            </Incomplete>
          )}
        </BtnGroup>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{ isDownload: boolean }>`
  border: 1px solid #dedede;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  max-width: ${breakpoints.mobile}px;
  width: 100%;

  ${({ isDownload }) => {
    if (isDownload) {
      return css`
        * {
          color: ${({ theme }) => theme.greyScale25};
        }
      `;
    }
  }}
`;

const Wrapper = styled.div`
  padding: 24px 0 24px 24px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  width: 70%;
`;

const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;

  > svg {
  }
`;

const Complete = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Incomplete = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Dot = styled.div`
  display: flex;
  background-color: ${theme.black};
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin: 0px 8px;
`;

export default CouponItem;
