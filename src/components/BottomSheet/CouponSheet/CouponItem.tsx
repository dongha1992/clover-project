import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { TextH3B, TextB3R, TextB2R18, TextB4R, TextH7B, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { breakpoints } from '@utils/common/getMediaQuery';
import { FlexRow } from '@styles/theme';
import dayjs from 'dayjs';
import { Tag } from '@components/Shared/Tag';
import { getCustomDate } from '@utils/destination';
import { commonSelector } from '@store/common';
import { useSelector } from 'react-redux';
import { IPromotion } from '@model/index';
interface IProps {
  coupon: IPromotion;
  onClick: (coupon: IPromotion) => void;
}

const CouponItem = ({ coupon, onClick }: IProps) => {
  const [isShow, setIsShow] = useState(false);

  const { isMobile } = useSelector(commonSelector);

  const isRateDiscount = coupon.coupon.criteria === 'RATIO';
  const { dayFormatter: expiredDate } = getCustomDate(new Date(coupon?.coupon.expiredDate));

  const { participationStatus } = coupon;

  const isDownloaded = participationStatus === 'COMPLETED';

  const isMoreThenOneMenu = coupon?.coupon?.descriptions?.join().includes('특정 상품');
  const tagetIndex = coupon?.coupon?.descriptions?.findIndex((item) => item.includes('특정 상품'));

  return (
    <Container isDownloaded={isDownloaded}>
      <Wrapper>
        <Content>
          <TextH3B color={theme.brandColor}>
            {isRateDiscount ? `${coupon?.coupon.value}%` : `${coupon?.coupon.value}원`}
          </TextH3B>
          <TextH5B padding="4px 0 8px 0">{coupon?.name}</TextH5B>
          {coupon?.coupon?.descriptions?.map((description: string, index: number) => {
            if (index === tagetIndex + 1 && !isShow) {
              return;
            }
            return (
              <TextB4R color={theme.greyScale65} key={index}>
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
          <FlexRow margin="8px 0 0 0">
            {coupon?.coupon.isApp && (
              <TextH7B color={theme.brandColor} margin="0 4px 0 0">
                APP 전용
              </TextH7B>
            )}
            <TextB4R color={theme.brandColor}>{expiredDate} 까지</TextB4R>
          </FlexRow>
        </Content>
        <BtnGroup>
          <SVGIcon name="dotColumn" />
          {(participationStatus === 'COMPLETED' || participationStatus === 'DUPLICATED') && (
            <Complete>
              <SVGIcon name="couponDownloadComplete" />
            </Complete>
          )}
          {participationStatus === 'POSSIBLE' && (
            <Incomplete
              onClick={() => {
                if (isMobile) {
                  if (!coupon.coupon.isApp) return;
                }
                onClick(coupon);
              }}
            >
              <SVGIcon name="couponDownloadAvailable" />
            </Incomplete>
          )}
          {participationStatus === 'IMPOSSIBLE' && (
            <Complete>
              <SVGIcon name="blockCoupon" />
            </Complete>
          )}
        </BtnGroup>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{ isDownloaded: boolean }>`
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
