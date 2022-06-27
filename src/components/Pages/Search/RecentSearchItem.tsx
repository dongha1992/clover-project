import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { TextB2R } from '@components/Shared/Text';

const RecentSearchItem = ({ keyword, removeRecentSearchItemHandler, selectRecentSearchItemHandler }: any) => {
  return (
    <Container>
      <TextB2R onClick={() => selectRecentSearchItemHandler(keyword)} pointer>
        {keyword}
      </TextB2R>
      <RemoveBtn onClick={() => removeRecentSearchItemHandler(keyword)}>
        <SVGIcon name="removeItem" />
      </RemoveBtn>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0px;
`;

const RemoveBtn = styled.div`
  cursor: pointer;
`;

export default React.memo(RecentSearchItem);
