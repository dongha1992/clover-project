import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { TextH4B, TextH7B, TextB4R, TextB2R18 } from '@components/Shared/Text';
import { FlexBetween, theme, FlexRow, FlexCol } from '@styles/theme';
import { breakpoints } from '@utils/common/getMediaQuery';
import { Tag } from '@components/Shared/Tag';
import { ICoupon } from '@model/index';
import { getCustomDate } from '@utils/destination/';
import dayjs from 'dayjs';
interface IProps {
  coupon: ICoupon;
  selectCouponHandler: (coupon: ICoupon) => void;
  isSelected: boolean;
}

const now = dayjs();

const MypageCouponItem = ({ coupon, selectCouponHandler, isSelected }: IProps) => {
  const [isShow, setIsShow] = useState(false);

  const { dayFormatter: expiredDate } = getCustomDate(new Date(coupon.expiredDate));
  const isRateDiscount = coupon.criteria === 'RATIO';

  const dDay = now.diff(dayjs(coupon.expiredDate), 'day');

  const isMoreThenOneMenu = coupon?.descriptions?.join().includes('특정 상품');
  const tagetIndex = coupon?.descriptions?.findIndex((item) => item.includes('특정 상품'));
  const canNotUse = !coupon.canUse;
  const tagColorSet = canNotUse ? theme.greyScale6 : theme.brandColor5;
  const priceColorSet = canNotUse ? theme.greyScale25 : theme.brandColor;
  const tagNameColorSet = canNotUse ? theme.greyScale45 : theme.brandColor;
  const nameColorSet = canNotUse ? theme.greyScale25 : theme.black;
  const desColorSet = canNotUse ? theme.systemRed : theme.black;
  return (
    <Container
      isDownload={canNotUse}
      isSelected={isSelected}
      onClick={() => {
        if (canNotUse) {
          return;
        }
        selectCouponHandler(coupon);
      }}
    >
      <Wrapper>
        <Content>
          <FlexBetween padding="0 0 4px 0">
            <TextH4B color={priceColorSet}>{isRateDiscount ? `${coupon.value}%` : `${coupon.value}원`}</TextH4B>
            <Tag backgroundColor={tagColorSet} color={tagNameColorSet}>
              D-{dDay}
            </Tag>
          </FlexBetween>
          <TextB2R18 color={nameColorSet}>{coupon.name}</TextB2R18>
          <FlexCol padding="8px 0 0 0">
            {coupon.descriptions.map((description, index) => {
              if (index === tagetIndex + 1 && !isShow) {
                return;
              }
              return (
                <TextB4R color={desColorSet} key={index}>
                  {description}
                </TextB4R>
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
          </FlexCol>
          <FlexRow margin="8px 0 0 0">
            {coupon.isApp && (
              <TextH7B color={theme.brandColor} margin="0 4px 0 0">
                APP 전용
              </TextH7B>
            )}
            <TextB4R color={theme.brandColor}>{expiredDate} 까지</TextB4R>
          </FlexRow>
        </Content>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{ isDownload?: boolean; isSelected?: boolean }>`
  border: 1px solid
    ${({ isSelected, isDownload }) =>
      isDownload ? theme.greyScale15 : isSelected ? theme.brandColor : theme.brandColor5};
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  max-width: ${breakpoints.mobile}px;
  width: 100%;
  cursor: pointer;
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
