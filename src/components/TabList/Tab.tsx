import { TextB1R, TextB1B } from '@components/Text';
import React from 'react';
import styled, { css } from 'styled-components';

interface ITabProps {
  tabItem: any;
  onClick: any;
  selectedTab: any;
  numebrOfReview?: any;
}

function Tab({ tabItem, onClick, selectedTab, numebrOfReview }: ITabProps) {
  const style = {
    padding: '12px 8px',
    whiteSpace: 'nowrap',
    pointer: true,
  };
  const isReviewTab = tabItem.text === '후기';
  const tabNameWithNumberOfReview = `${tabItem.text} (${numebrOfReview})`;

  return (
    <Wrapper onClick={() => onClick(tabItem)} selectedTab={selectedTab}>
      <Border>
        <TextB1R className="tab" {...style}>
          {!isReviewTab ? tabItem.text : tabNameWithNumberOfReview}
        </TextB1R>
      </Border>
    </Wrapper>
  );
}
const Wrapper = styled.div<{ selectedTab: boolean }>`
  width: 100%;
  text-align: center;
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
  .tab {
    font-weight: ${({ selectedTab }) => (selectedTab ? 'bold' : 'normal')};
  }
`;

const Border = styled.div``;

export default React.memo(Tab);
