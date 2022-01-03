import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R } from '@components/Shared/Text';
import { FlexRow } from '@styles/theme';
import Tag from '@components/Shared/Tag';

const AddressItem = ({ roadAddr, bdNm, jibunAddr, onClick }: any) => {
  return (
    <Container onClick={onClick}>
      <TextH5B>{bdNm}</TextH5B>
      <FlexRow padding="4px 0 6px">
        <Tag padding="3px">도로명</Tag>
        <TextB3R margin="0 0 0 4px">{roadAddr}</TextB3R>
      </FlexRow>
      <FlexRow>
        <Tag padding="3px">지번</Tag>
        <TextB3R margin="0 0 0 4px">{jibunAddr}</TextB3R>
      </FlexRow>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  cursor: pointer;
`;

export default AddressItem;
