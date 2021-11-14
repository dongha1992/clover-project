import { TextB1R, TextB1B } from '@components/Text';
import React from 'react';
import styled, { css } from 'styled-components';

function Tab({ category, onClick, selectedTab }: any) {
  const style = {
    padding: '12px 8px',
    whiteSpace: 'nowrap',
    pointer: true,
  };
  return (
    <Wrapper onClick={() => onClick(category)} selectedTab={selectedTab}>
      <Border>
        {selectedTab ? (
          <TextB1B {...style}> {category.title}</TextB1B>
        ) : (
          <TextB1R {...style}>{category.title}</TextB1R>
        )}
      </Border>
    </Wrapper>
  );
}
const Wrapper = styled.div<{ selectedTab: boolean }>`
  ${({ selectedTab }) => {
    if (selectedTab) {
      return css`
        border-bottom: 2px solid ${({ theme }) => theme.black};
      `;
    } else {
      return css`
        border-bottom: 1px solid ${({ theme }) => theme.greyScale6};
      `;
    }
  }}
`;
const Border = styled.div``;

export default React.memo(Tab);
