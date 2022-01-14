import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/getMediaQuery';
import { IMAGE_S3_URL } from '@constants/mock';

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

interface ISpotsItems {
  lunchDeliveryStartTime: string;
  lunchDeliveryEndTime: string;
  dinnerDeliveryStartTime: string;
  dinnerDeliveryEndTime: string;
  name: string;
  location: {
    address: string;
  };
  distance: number;
  isTrial: boolean;
  images: [{
    url: string;
  }];
  type: string;
}

interface IProps {
  item: ISpotsItems;
  onClick: () => void;
  mapList?: boolean;
}

const SpotRecentSearch = ({ item, onClick, mapList }: IProps): ReactElement => {
  const typeTag = (): string => {
    const type = item.type;
    switch(type){
      case 'PRIVATE': 
        return '프라이빗';
      case 'PUBLIC':
        return '퍼블릭';
      default: 
        return '';
    };
  };

  const pickUpTime = 
  `${item.lunchDeliveryStartTime.slice(0,5)}-${item.lunchDeliveryEndTime.slice(0,5)} / ${item.dinnerDeliveryStartTime.slice(0,5)}-${item.dinnerDeliveryEndTime.slice(0,5)}`;


  return (
    <Container mapList>
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item.location.address}</TextB3R>
        <MeterAndTime>
          <TextH6B>{`${Math.round(item.distance)}m`}</TextH6B>
          <Col />
          <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
            픽업
          </TextH6B>
          <TextH6B color={theme.greyScale65}>
            {pickUpTime}
          </TextH6B>
        </MeterAndTime>
        {
          !item.isTrial ?
          <div>
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              {typeTag()}
            </Tag>
          </div>
        :
          <div>
            <Tag backgroundColor={theme.greyScale6} color={theme.greyScale45}>
              트라이얼
            </Tag>
          </div>
        }
      </FlexColStart>
      <FlexCol>
        <ImageWrapper mapList>
          <SpotImg src={`${IMAGE_S3_URL}${item.images[0].url}`}/>
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

const Container = styled.section<{ mapList: boolean }>`
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
export default React.memo(SpotRecentSearch);
