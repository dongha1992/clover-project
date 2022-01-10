import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';

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

const SpotRecommendList = ({ item }: any): ReactElement => {
  return (
    <Container>
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item.address}</TextB3R>
        <MeterAndTime>
          <TextH6B>{item.meter}m</TextH6B>
          <Col />
          <TextH6B>{item.type}</TextH6B>
          <TextH6B>{item.availableTime}</TextH6B>
        </MeterAndTime>
        <div>
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            {item.spaceType}
          </Tag>
        </div>
      </FlexColStart>
      <FlexCol>
        <ImageWrapper>
          <SpotImg src={item.url} />
        </ImageWrapper>
      </FlexCol>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 114px;
  margin-bottom: 24px;
`;


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
  border-radius: 8px;
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 4px;
`;

export default SpotRecommendList;