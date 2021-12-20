import { TextB1R, TextB1B } from '@components/Text';
import React from 'react';
import styled, { css } from 'styled-components';

interface ITabProps {
  tabItem: any;
  onClick: any;
  selectedTab: any;
  countObj?: any;
}

/* Tab에 Count 붙는 경우 countObj={ tabItem.title : count } props 받아서 맵핑으로 렌더*/

function Tab({ tabItem, onClick, selectedTab, countObj }: ITabProps) {
  const style = {
    padding: '12px 8px',
    whiteSpace: 'nowrap',
    pointer: true,
  };

  /* Tab에 카운트 있는지 판별 */
  const hasCount = countObj && countObj[tabItem.text];

  const tabNameWithCount =
    hasCount && `${tabItem.text} (${countObj[tabItem.text]})`;

  return (
    <Wrapper onClick={() => onClick(tabItem)} selectedTab={selectedTab}>
      <Border>
        <TextB1R className="tab" {...style}>
          {hasCount ? tabNameWithCount : tabItem.text}
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
