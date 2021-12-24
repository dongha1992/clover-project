import { TextH5B } from '@components/Shared/Text';
import React from 'react';
import { FlexCol } from '@styles/theme';
import styled from 'styled-components';
import AddressItem from '../Location/addressItem';

function DestinationSearchResult({ resultAddress, onClick, totalCount }: any) {
  return (
    <Container>
      <TextH5B padding="0 0 24px 0">검색 결과 {totalCount}개</TextH5B>
      <FlexCol>
        {resultAddress.map((item: any, index: number) => {
          return (
            <AddressItem
              roadAddr={item.roadAddr}
              bdNm={item.bdNm}
              jibunAddr={item.jibunAddr}
              onClick={onClick}
              key={index}
            />
          );
        })}
      </FlexCol>
    </Container>
  );
}

const Container = styled.div``;

export default DestinationSearchResult;
