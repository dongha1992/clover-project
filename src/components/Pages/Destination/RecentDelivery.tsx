import { TextH5B, TextB3R } from '@components/Shared/Text';
import React from 'react';
import styled from 'styled-components';
import { FlexCol } from '@styles/theme';

const RecentDelivery = ({ recentDeliveryList }: any) => {
  return (
    <Container>
      <TextH5B>최근 배송 이력</TextH5B>
      <FlexCol>
        {recentDeliveryList.map((item: any, index: number) => (
          <FlexCol key={index} padding="24px 0 0 0">
            <TextH5B>{item.name}</TextH5B>
            <TextB3R padding="4px 0 0 0">{item.address}</TextB3R>
          </FlexCol>
        ))}
      </FlexCol>
    </Container>
  );
};

const Container = styled.div``;

export default RecentDelivery;
