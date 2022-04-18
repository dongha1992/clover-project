import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { TextH3B, TextB3R, TextH5B, TextH7B, TextB4R } from '@components/Shared/Text';
import { FlexBetween, theme, FlexRow } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import { Tag } from '@components/Shared/Tag';
import { ICoupon } from '@model/index';
import getCustomDate from '@utils/getCustomDate';
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
  return (
    <Container isSelected={isSelected} onClick={() => selectCouponHandler(coupon)}>
      <Wrapper>
        <Content>
          <FlexBetween padding="0 0 4px 0">
            <TextH3B color={theme.brandColor}>{isRateDiscount ? `${coupon.value}%` : `${coupon.value}원`}</TextH3B>
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              D-{dDay}
            </Tag>
          </FlexBetween>
          <TextH5B>{coupon.name}</TextH5B>
          {/* {coupon.deliveryMethod && (
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
          )} */}
          {/* {isShow &&
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
              padding="4px 0 0 0"
            >
              {isShow ? '접기' : '더보기'}
            </TextH7B>
          )} */}

          <TextB3R color={theme.brandColor} padding="4px 0 0 0">
            {expiredDate} 까지
          </TextB3R>
        </Content>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{ isDownload?: boolean; isSelected?: boolean }>`
  border: 1px solid ${({ isSelected }) => (isSelected ? theme.brandColor : theme.brandColor5)};
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
