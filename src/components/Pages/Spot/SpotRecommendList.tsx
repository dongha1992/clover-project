import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import { IMAGE_S3_URL } from '@constants/mock/index';
import { ISpotsItems } from '@components/Pages/Spot/SpotRecentSearch';

interface IParams {
  item: ISpotsItems;
}

const SpotRecommendList = ({ item }: IParams): ReactElement => {

  const typeTag = (): string | null => {
    const type = item?.type;
    switch (type) {
      case 'PRIVATE': 
        return '프라이빗';
      case 'PUBLIC':
        return '퍼블릭'
      default:
        return null;
    }
  };
  
  const pickUpTime = 
    `${item.lunchDeliveryStartTime}-${item.lunchDeliveryEndTime} / ${item.dinnerDeliveryStartTime}-${item.dinnerDeliveryEndTime}`;
  
    return (
      <Container>
        <FlexColStart>
          <TextH5B>{item.name}</TextH5B>
          <TextB3R padding="2px 0 0 0">
            {`${item.location.address} ${item.location.addressDetail}`}
          </TextB3R>
          <MeterAndTime>
            <TextH6B color={theme.greyScale65}>{`${Math.round(item.distance)}m`}</TextH6B>
            <Col />
            <TextH6B color={theme.greyScale65}>픽업&nbsp;</TextH6B>
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
          <ImageWrapper>
            <SpotImg src={`${IMAGE_S3_URL}${item.images[0].url}`} />
          </ImageWrapper>
        </FlexCol>
    </Container>
  );
};

const Container = styled.section`
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
