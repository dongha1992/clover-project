import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R } from '@components/Shared/Text';
import { FlexCol, theme, FlexRow } from '@styles/theme';
import { DeliveryTag, Tag } from '@components/Shared/Tag';

const DeliveryPlaceBox = ({ place, type }: any): ReactElement => {
  return (
    <FlexCol padding="0 0 0 0">
      <DelvieryPlaceInfo>
        <PlaceName>
          <FlexRow>
            <TextH5B padding="0 4px 0 0">{place.name}</TextH5B>
            <DeliveryTag deliveryType={place.delivery || type} margin="0 4px" />
            {place.main && <Tag>메인 배송지</Tag>}
          </FlexRow>
        </PlaceName>
        <TextB3R padding="4px 0" color={theme.greyScale65}>
          {place.location.address}
        </TextB3R>
      </DelvieryPlaceInfo>
    </FlexCol>
  );
};

const DelvieryPlaceInfo = styled.div`
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

export default React.memo(DeliveryPlaceBox);
