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
import { ISpotItem } from '@components/Pages/Spot/SpotRecentSearch';
import { Obj } from '@model/index';

interface IProps {
  item: ISpotItem;
  goToCart: () => void;
  goToEdit: (id: number) => void;
}

const PickupItem = ({ item, goToCart, goToEdit }: IProps) => {
  const mapper: Obj = {
    프라이빗: {
      backgroundColor: theme.brandColor5,
      color: theme.brandColor,
    },
  };
  return (
    <Container>
      <FlexCol>
        <FlexBetween>
          <FlexRow>
            <TextH5B padding="0 8px 0 0">{item.name}</TextH5B>
            <Tag margin="0 4px 0 0" {...mapper[item.spaceType]}>
              {item.spaceType}
            </Tag>
            <Tag>기본 프코스팟</Tag>
          </FlexRow>
          <TextH6B
            color={theme.greyScale65}
            textDecoration="underline"
            onClick={() => goToEdit(item.id)}
          >
            편집
          </TextH6B>
        </FlexBetween>
        <TextB3R padding="4px 0 0 0">{item.address}</TextB3R>
        <FlexRow padding="5px 0 9px 0">
          <TextB3R color={theme.greyScale65} padding="">
            유저 이름
          </TextB3R>
          <Col />
          <TextB3R color={theme.greyScale65}>번호</TextB3R>
        </FlexRow>
        <FlexRow>
          <TextH6B padding="0 4px 0 0">픽업</TextH6B>
          <TextB3R>{item.availableTime}</TextB3R>
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

export default PickupItem;
