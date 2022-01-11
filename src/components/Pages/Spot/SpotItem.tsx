import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/getMediaQuery';

export interface ISpotItem {
  id: number;
  name: string;
  address: string;
  meter: string;
  type: string;
  availableTime: string;
  spaceType: string;
  url: string;
  method: string;
}

interface IProps {
  item: ISpotItem;
  onClick: () => void;
  mapList?: boolean;
}

const SpotItem = ({ item, onClick, mapList }: IProps): ReactElement => {
  return (
    <Container mapList>
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item.address}</TextB3R>
        <MeterAndTime>
          <TextH6B>{item.meter}m</TextH6B>
          <Col />
          <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
            {item.type}
          </TextH6B>
          <TextH6B color={theme.greyScale65}>{item.availableTime}</TextH6B>
        </MeterAndTime>
        <div>
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            {item.spaceType}
          </Tag>
        </div>
      </FlexColStart>
      <FlexCol>
        <ImageWrapper mapList>
          <SpotImg src={item.url} />
        </ImageWrapper>
        <Button
          backgroundColor={theme.white}
          color={theme.black}
          height="38px"
          border
          onClick={onClick}
        >
          주문하기
        </Button>
      </FlexCol>
    </Container>
  );
};

const Container = styled.div<{ mapList: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 114px;
  margin-bottom: 24px;
  ${({ mapList }) => {
    if (mapList) {
      return css`
        background: ${theme.white};
        max-width: ${breakpoints.desktop}px;
        max-width: ${breakpoints.mobile}px;
        height: 146px;
        padding: 16px;
        border-radius: 8px;
      `;
    }
  }}
`;


const MeterAndTime = styled.div`
  display: flex;
  margin: 8px 0 16px 0;
`;

const ImageWrapper = styled.div<{ mapList: boolean }>`
  width: 80px;
  padding-left: 15px;
  ${({ mapList }) => {
    if (mapList) {
      return css`
        margin-bottom: 10px;
      `;
    }
  }}
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
