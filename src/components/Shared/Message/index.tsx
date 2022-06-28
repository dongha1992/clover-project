import React from 'react';
import { TextB3R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { Obj } from '@model/index';
import { getHolidayByMenu } from '@utils/menu';
interface IProps {
  isSold?: boolean;
  holiday?: number[][];
  availabilityInfo?: {
    availability: boolean;
    remainingQuantity: number;
    menuDetailAvailabilityMessage?: string;
  };
}

/* TODO: 최대 구매? */

const InfoMessage = ({ isSold, holiday, availabilityInfo }: IProps) => {
  const getCartMenuStatus = () => {
    const hasLimitDate = holiday?.length! > 0;
    const hasLimitQuantity = availabilityInfo?.availability! && availabilityInfo?.remainingQuantity! > 0;

    switch (true) {
      case isSold: {
        return <TextB3R color={theme.brandColor}>품절된 상품이에요.</TextB3R>;
      }
      case hasLimitDate: {
        return <TextB3R color={theme.brandColor}>{getHolidayByMenu(holiday!)} 배송이 불가능해요</TextB3R>;
      }
      case hasLimitQuantity: {
        return (
          <TextB3R color={theme.brandColor}>품절 임박! 상품이 {availabilityInfo?.remainingQuantity}개 남았어요</TextB3R>
        );
      }
      default: {
        return '';
      }
    }
  };

  return (
    <Container>
      <div>
        <SVGIcon name="exclamationMark" />
      </div>
      <div>{getCartMenuStatus()}</div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;

  > div {
    align-self: flex-start;
  }
`;

export default React.memo(InfoMessage);
