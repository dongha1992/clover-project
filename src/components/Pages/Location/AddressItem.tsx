import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexRow } from '@styles/theme';
import Tag from '@components/Shared/Tag';

function AddressItem({ roadAddr, bdNm, jibunAddr, zipNo, onClick }: any) {
  return (
    <Container onClick={onClick}>
      <FlexRow width="100%">
        <TextH6B>
          {roadAddr} {bdNm}
        </TextH6B>
      </FlexRow>
      <FlexRow>
        <Tag padding="3px">지번</Tag>
        <TextB3R margin="0 0 0 4px">
          {`(${zipNo})`} {jibunAddr}
        </TextB3R>
      </FlexRow>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  cursor: pointer;
`;

export default AddressItem;
