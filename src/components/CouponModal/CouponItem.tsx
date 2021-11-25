import React from 'react';
import styled, { css } from 'styled-components';
import { TextH3B, TextB3R, TextB2R } from '@components/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';

function CouponItem({ coupon }: any) {
  const isRateDiscount = coupon.type === 'rate';
  return (
    <Container isDownload={coupon.isDownload}>
      <Wrapper>
        <Content>
          <TextH3B color={theme.brandColor}>
            {isRateDiscount ? `${coupon.discount}%` : `${coupon.discount}원`}
          </TextH3B>
          <TextB2R>{coupon.name}</TextB2R>
          {coupon.canUseMenu && (
            <TextB3R color={theme.greyScale65}>{coupon.canUseMenu}</TextB3R>
          )}
          {coupon.condition && <TextB3R>{coupon.condition}</TextB3R>}
          <TextB3R color={theme.brandColor}>{coupon.expireDate}</TextB3R>
        </Content>
        <BtnGroup>
          <SVGIcon name="dotColumn" />
          {coupon.isDownload ? (
            <Complete>
              <SVGIcon name="couponDownloadComplete" />
            </Complete>
          ) : (
            <Incomplete>
              <SVGIcon name="couponDownloadAvailable" />
            </Incomplete>
          )}
        </BtnGroup>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div<{ isDownload: boolean }>`
  border: 1px solid #dedede;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  max-width: 504px;
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
  padding: 24px;
  display: flex;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
`;

const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 24px;
  width: 30%;
  svg:first-child {
    margin-right: 16px;
  }
`;

const Complete = styled.div`
  padding-left: 16px;
`;

const Incomplete = styled.div``;

export default CouponItem;
