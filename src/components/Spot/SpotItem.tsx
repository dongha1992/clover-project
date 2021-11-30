import React from 'react';
import styled from 'styled-components';
import { theme, FlexBetween, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Text';
import Tag from '@components/Tag';
import Button from '@components/Button';

export interface ISpotItem {
  id: number;
  name: string;
  address: string;
  meter: string;
  type: string;
  availableTime: string;
  spaceType: string;
  url: string;
}

interface IProps {
  item: ISpotItem;
  onClick: () => void;
}

function SpotItem({ item, onClick }: IProps) {
  return (
    <Container>
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R>{item.address}</TextB3R>
        <MeterAndTime>
          <TextH6B>{item.meter}m</TextH6B>
          <Col />
          <TextH6B>{item.type}</TextH6B>
          <TextH6B>{item.availableTime}</TextH6B>
        </MeterAndTime>
        <div>
          <Tag
            margin="0"
            backgroundColor={theme.brandColor5}
            color={theme.brandColor}
          >
            {item.spaceType}
          </Tag>
        </div>
      </FlexColStart>
      <FlexCol>
        <ImageWrapper>
          <SpotImg src={item.url} />
        </ImageWrapper>
        <Button
          backgroundColor={theme.white}
          color={theme.black}
          border
          onClick={onClick}
        >
          주문하기
        </Button>
      </FlexCol>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 114px;
  margin-bottom: 24px;
`;

const Left = styled.div``;
const Right = styled.div``;

const MeterAndTime = styled.div`
  display: flex;
  margin: 8px 0 16px 0;
`;

const ImageWrapper = styled.div`
  width: 80px;
  padding-left: 15px;
`;

const SpotImg = styled.img`
  width: 100%;
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 4px;
`;
export default React.memo(SpotItem);
