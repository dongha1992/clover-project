import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  TextH3B,
  TextB3R,
  TextB2R,
  TextH7B,
  TextB4R,
} from '@components/Shared/Text';
import { FlexBetween, theme, FlexRow } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import Tag from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { bottomSheetButton } from '@styles/theme';

const MypageCouponItem = ({ coupon }: any) => {
  const [isShow, setIsShow] = useState(false);

  const isRateDiscount = coupon.type === 'rate';
  const isMoreThenOneMenu = coupon.canUseMenu.length > 1;

  const submitHandler = () => {};
  return (
    <Container isDownload={coupon.isDownload}>
      <Wrapper>
        <Content>
          <FlexBetween padding="0 0 4px 0">
            <TextH3B color={theme.brandColor}>
              {isRateDiscount ? `${coupon.discount}%` : `${coupon.discount}원`}
            </TextH3B>
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              D-1
            </Tag>
          </FlexBetween>
          <TextB2R>{coupon.name}</TextB2R>

          {coupon.deliveryMethod && (
            <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
              배송방법: {coupon.deliveryMethod}
            </TextB3R>
          )}
          {coupon.condition && (
            <TextB3R padding="2px 0 0 0" color={theme.greyScale65}>
              {coupon.condition}
            </TextB3R>
          )}
          {coupon.canUseMenu && (
            <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
              사용가능 메뉴:
              {isMoreThenOneMenu ? '특정 상품 한정' : coupon.canUseMenu[0]}
            </TextB3R>
          )}
          {isShow &&
            coupon.canUseMenu.map((menu: any) => {
              return (
                <FlexRow>
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
              padding="4px 0 0 0"
            >
              {isShow ? '접기' : '더보기'}
            </TextH7B>
          )}

          <TextB3R color={theme.brandColor} padding="4px 0 0 0">
            {coupon.expireDate}
          </TextB3R>
        </Content>
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
`;

const Wrapper = styled.div`
  padding: 24px;
  display: flex;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
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

export default MypageCouponItem;
