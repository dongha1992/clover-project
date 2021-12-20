import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { TextB2R } from '@components/Shared/Text';

function RecentSearchItem({ keyword, onClick }: any) {
  return (
    <Container>
      <TextB2R>{keyword}</TextB2R>
      <RemoveBtn onClick={() => onClick(keyword)}>
        <SVGIcon name="removeItem" />
      </RemoveBtn>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0px;
`;

const RemoveBtn = styled.div`
  cursor: pointer;
`;

export default React.memo(RecentSearchItem);
