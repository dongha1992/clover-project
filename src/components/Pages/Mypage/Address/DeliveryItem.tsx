import React from 'react';
import styled from 'styled-components';
import {
  theme,
  FlexBetween,
  FlexCol,
  FlexRow,
  homePadding,
} from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { IDestinationsResponse } from '@model/index';
import { Obj } from '@model/index';

interface IProps {
  item: IDestinationsResponse;
  goToCart: () => void;
  goToEdit: (id: number) => void;
}

const DeliveryItem = ({ item, goToCart, goToEdit }: IProps) => {
  const mapper: Obj = {
    MORNING: '새벽배송',
    PARCEL: '택배배송',
    QUICK: '퀵배송',
  };
  return (
    <Container>
      <FlexCol>
        <FlexBetween>
          <FlexRow>
            <TextH5B padding="0 8px 0 0">{item.name}</TextH5B>
            <Tag
              margin="0 4px 0 0"
              padding="4px 8px 4px 6px"
              backgroundColor={theme.brandColor5}
              color={theme.brandColor}
              center
            >
               {mapper[item.delivery]}
            </Tag>
            {item.main && <Tag>기본 베송지</Tag>}
          </FlexRow>
          <TextH6B
            color={theme.greyScale65}
            textDecoration="underline"
            onClick={() => goToEdit(item.id)}
          >
            편집
          </TextH6B>
        </FlexBetween>
        <FlexRow padding="4px 0 0 0">
          <TextB3R padding="0 4px 0 0">{item.location.address}</TextB3R>
          <TextB3R>{item.location.addressDetail}</TextB3R>
        </FlexRow>

        <FlexRow padding="5px 0 0 0">
          <TextB3R color={theme.greyScale65} padding="">
            {item.name}
          </TextB3R>
          <Col />
          <TextB3R color={theme.greyScale65}>{item.receiverTel}</TextB3R>
        </FlexRow>
      </FlexCol>
      <Button
        onClick={goToCart}
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

export default DeliveryItem;
