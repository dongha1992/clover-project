import { TextH5B, TextB3R } from '@components/Shared/Text';
import React from 'react';
import styled from 'styled-components';
import { FlexCol, FlexRow } from '@styles/theme';
import { IDestinationsResponse } from '@model/index';
import { DeliveryTag, Tag } from '@components/Shared/Tag';

interface IProps {
  filteredList: IDestinationsResponse[];
  onClick: (item: IDestinationsResponse) => void;
}

const RecentDelivery = ({ filteredList, onClick }: IProps) => {
  return (
    <Container>
      <TextH5B>최근 배송 이력</TextH5B>
      <FlexCol>
        {filteredList.map((item: IDestinationsResponse, index: number) => (
          <FlexCol key={index} padding="24px 0 0 0" onClick={() => onClick(item)} pointer>
            <FlexRow>
              <TextH5B>{item.name}</TextH5B>
              <DeliveryTag deliveryType={item.delivery} margin="0 4px" />
              {item.main && <Tag>메인 배송지</Tag>}
            </FlexRow>
            <TextB3R padding="4px 0 0 0">{item?.location?.address}</TextB3R>
          </FlexCol>
        ))}
      </FlexCol>
    </Container>
  );
};

const Container = styled.div``;

export default React.memo(RecentDelivery);
