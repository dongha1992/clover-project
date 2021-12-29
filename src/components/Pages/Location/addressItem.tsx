import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexColStart, FlexRow, FlexRowStart, FlexStart } from '@styles/theme';
import Tag from '@components/Shared/Tag';

function AddressItem({ roadAddr, bdNm, jibunAddr, zipNo, onClick }: any) {
  return (
    <Container onClick={onClick}>
      <FlexRow width="100%">
        <TextH6B padding="0 4px 0 0">
          {roadAddr}
          &nbsp;
          {bdNm}
        </TextH6B>
      </FlexRow>
      <FlexRowStart padding="4px 0 6px">
        <Tag padding="2px" width="8%" center>
          지번
        </Tag>
        <TextB3R margin="2px 0 0 4px">
          {`(${zipNo}) `}
          {jibunAddr}
        </TextB3R>
      </FlexRowStart>
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
