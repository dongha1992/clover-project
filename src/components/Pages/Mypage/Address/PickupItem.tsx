import React from 'react';
import styled from 'styled-components';
import { theme, FlexBetween, FlexCol, FlexRow, homePadding } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { Obj } from '@model/index';
import { IDestinationsResponse } from '@model/index';

interface IProps {
  item: IDestinationsResponse;
  goToCart: (item: IDestinationsResponse) => void;
  goToEdit: ({ id, spotPickupId }: { id: number; spotPickupId: number }) => void;
}

const PickupItem = ({ item, goToCart, goToEdit }: IProps) => {
  const { spotPickup, main, location, name, receiverName, receiverTel } = item;
  const mapper: Obj = {
    PRIVATE: {
      name: '프라이빗',
      backgroundColor: theme.brandColor5,
      color: theme.brandColor,
    },
    // PUBLIC: { name: '퍼블릭', backgroundColor: theme.greyScale6, color: theme.greyScale45 },
    TRIAL: { name: '트라이얼', backgroundColor: theme.greyScale6, color: theme.greyScale45 },
  };

  return (
    <Container>
      <FlexCol>
        <FlexBetween>
          <FlexRow>
            <TextH5B padding="0 8px 0 0">{name}</TextH5B>
            <Tag margin="0 4px 0 0" {...mapper[spotPickup?.spot.type!]}>
              {mapper[spotPickup?.spot.type!].name}
            </Tag>
            {main && <Tag>기본 프코스팟</Tag>}
          </FlexRow>
          <TextH6B
            color={theme.greyScale65}
            textDecoration="underline"
            onClick={() => goToEdit({ id: item?.id!, spotPickupId: item?.spotPickup?.id! })}
          >
            편집
          </TextH6B>
        </FlexBetween>
        <TextB3R padding="4px 0 0 0">{location?.address}</TextB3R>
        <FlexRow padding="5px 0 9px 0">
          <TextB3R color={theme.greyScale65} padding="">
            {receiverName}
          </TextB3R>
          <Col />
          <TextB3R color={theme.greyScale65}>{receiverTel}</TextB3R>
        </FlexRow>
        <FlexRow>
          <TextH6B padding="0 4px 0 0">픽업</TextH6B>
          <TextB3R>{`${spotPickup?.spot.pickupStartTime}-${spotPickup?.spot.pickupEndTime}`}</TextB3R>
        </FlexRow>
      </FlexCol>
      <Button
        onClick={() => goToCart(item)}
        backgroundColor={theme.white}
        border
        color={theme.black}
        margin="16px 0 24px 0"
      >
        주문하기
      </Button>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;

const Col = styled.div`
  width: 1px;
  height: 16px;
  margin-left: 4px;
  margin-right: 4px;
  background-color: ${({ theme }) => theme.greyScale6};
`;

export default PickupItem;
