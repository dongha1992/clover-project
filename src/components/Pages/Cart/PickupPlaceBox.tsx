import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { TextH5B, TextH6B, TextB3R } from '@components/Shared/Text';
import { FlexBetween, FlexCol, homePadding, theme } from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import Tag from '@components/Shared/Tag';

const PickupPlaceBox = ({ place, checkTermHandler, isSelected }: any) => {
  return (
    <FlexCol padding="0 0 0 0">
      <PickPlaceInfo>
        <PlaceName>
          <TextH5B padding="0 4px 0 0">{place.name}</TextH5B>
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            {place.spaceType}
          </Tag>
        </PlaceName>
        <TextB3R padding="4px 0" color={theme.greyScale65}>
          {place.location.address}
        </TextB3R>
        <PlaceInfo>
          <TextH6B padding="0 4px 0 0" color={theme.greyScale65}>
            {place.type}
          </TextH6B>
          <TextB3R color={theme.greyScale65}>{place.availableTime}</TextB3R>
        </PlaceInfo>
      </PickPlaceInfo>
      <CheckTerm>
        <Checkbox isSelected={isSelected} onChange={checkTermHandler} />
        <span className="h5B">
          <span className="brandColor">임직원 전용</span>
          스팟으로, 외부인은 이용이 불가합니다.
        </span>
      </CheckTerm>
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
