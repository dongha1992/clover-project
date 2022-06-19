import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { TextH3B, TextB3R, TextB2R, TextB4R, TextH7B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { breakpoints } from '@utils/common/getMediaQuery';
import { FlexRow } from '@styles/theme';
import dayjs from 'dayjs';
import { Tag } from '@components/Shared/Tag';
import { getCustomDate } from '@utils/destination/';

const now = dayjs();

const CouponItem = ({ coupon, onClick }: any) => {
  const [isShow, setIsShow] = useState(false);

  console.log(coupon, 'coupon');
  const isRateDiscount = coupon.coupon.criteria === 'RATIO';
  const { dayFormatter: expiredDate } = getCustomDate(new Date(expiredDate));
  const dDay = now.diff(dayjs(coupon.coupon.expiredDate), 'day');

  return (
    <Container isDownload={coupon.isDownload}>
      <Wrapper>
        <Content>
          <TextH3B color={theme.brandColor}>{isRateDiscount ? `${coupon.value}%` : `${coupon.coupon.value}원`}</TextH3B>
          <TextB2R>{coupon.name}</TextB2R>

          {coupon?.coupon?.descriptions?.map((description: string, index: number) => {
            return (
              <TextB4R color={theme.greyScale65} key={index}>
                {description}
              </TextB4R>
            );
          })}
          {/* {isShow &&
            coupon.canUseMenu.map((menu: any, index: number) => {
              return (
                <FlexRow key={index}>
                  <Dot />
                  <TextB4R color={theme.greyScale65}>{menu}</TextB4R>
                </FlexRow>
              );
            })} */}
          {/* {isMoreThenOneMenu && (
            <TextH7B
              textDecoration="underline"
              onClick={() => setIsShow(!isShow)}
              color={theme.greyScale65}
              pointer
              padding="2px 0 8px 0"
            >
              {isShow ? '접기' : '더보기'}
            </TextH7B>
          )} */}
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            D-{dDay}
          </Tag>
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
