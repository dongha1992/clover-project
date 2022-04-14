import React from 'react';
import styled from 'styled-components';
import { TextH6B, TextB3R, TextH4B } from '@components/Shared/Text';
import { FlexBetween, FlexCol, homePadding, theme } from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import { Tag } from '@components/Shared/Tag';

const PickupPlaceBox = ({ place, checkTermHandler, isSelected }: any) => {
  const availableTime =
    place.availableTime ||
    `${place.spotPickup?.spot?.lunchDeliveryStartTime}-${place.spotPickup?.spot?.lunchDeliveryEndTime} / ${place.spotPickup?.spot?.dinnerDeliveryStartTime} - ${place.spotPickup?.spot?.dinnerDeliveryEndTime}`;

  const typeTag = (): string | null => {
    const type = place.spaceType || place.spotPickup?.spot?.type;
    switch (type) {
      case 'PRIVATE':
        return '프라이빗';
      case 'PUBLIC':
        return '퍼블릭';
      default:
        return null;
    }
  };

  return (
    <FlexCol padding="0 0 0 0">
      <PickPlaceInfo>
        <PlaceName>
          <TextH4B padding="0 4px 0 0">{place.name}</TextH4B>
          {typeTag() !== null && (
            <Tag backgroundColor="#EDF3F0" color={theme.brandColor}>
              {typeTag()}
            </Tag>
          )}
        </PlaceName>
        <TextB3R padding="4px 0" color={theme.black}>
          {place.location.address}
        </TextB3R>
        <PlaceInfo>
          <TextH6B padding="0 4px 0 0" color={theme.greyScale65}>
            픽업
          </TextH6B>
          <TextB3R color={theme.greyScale65}>{availableTime}</TextB3R>
        </PlaceInfo>
      </PickPlaceInfo>
      {place.spaceType === 'PRIVATE' && (
        <CheckTerm>
          <Checkbox isSelected={isSelected} onChange={checkTermHandler} />
          <span className="h5B">
            <span className="brandColor">임직원 전용</span>
            스팟으로, 외부인은 이용이 불가합니다.
          </span>
        </CheckTerm>
      )}
    </FlexCol>
  );
};

const PickPlaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 8px;
  padding: 16px;
`;

const PlaceName = styled.div`
  display: flex;
  align-items: center;
`;

const PlaceInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CheckTerm = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;

  .h5B {
    padding-top: 2px;
    font-size: 12px;
    letter-spacing: -0.4px;
    line-height: 18px;
    color: ${theme.greyScale65};
    .brandColor {
      color: ${theme.brandColor};
      font-weight: bold;
      padding-right: 4px;
      padding-left: 4px;
    }
  }
`;

export default React.memo(PickupPlaceBox);
