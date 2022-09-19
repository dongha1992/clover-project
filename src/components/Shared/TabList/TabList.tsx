import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import Tab from '@components/Shared/TabList/Tab';
import { theme } from '@styles/theme';
import { useSelector, useDispatch } from 'react-redux';
import { commonSelector } from '@store/common';
import useScrollCheck from '@hooks/useScrollCheck';

const TabList = ({ onClick, selectedTab, tabList, countObj, shadowValue }: any, ref: any) => {
  // const { isScroll } = useSelector(commonSelector);
  const isScroll = useScrollCheck();

  return (
    <Container scroll={isScroll} shadowValue={shadowValue}>
      <TabWrapper ref={ref}>
        {tabList.map((tabItem: any, index: number) => {
          const defaulUrl = selectedTab === tabItem.link;

          return (
            <Tab
              tabItem={tabItem}
              key={index}
              onClick={onClick}
              selectedTab={selectedTab === tabItem.link ? true : false}
              countObj={countObj}
            />
          );
        })}
      </TabWrapper>
    </Container>
  );
};

const Container = styled.div<{ scroll: boolean, shadowValue?: string }>`
  display: flex;
  height: 48px;
  justify-content: space-between;
  width: 100%;
  background-color: ${theme.white};
  ${({ scroll, shadowValue }) => {
    if (scroll) {
      return css`
        &::after{
          content: '';
          display: block;
          position: absolute;
          right: 0;
          left: 0px;
          bottom: ${shadowValue ? shadowValue : '-67px'};
          height: 20px;
          background-size: 30px auto;
          background-image: url("data:image/svg+xml,%3Csvg width='45' height='30' viewBox='0 0 45 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='45' height='30' fill='url(%23paint0_linear_1899_3133)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_1899_3133' x1='22.5' y1='0' x2='22.5' y2='16.5' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-opacity='0.2'/%3E%3Cstop offset='0.135417' stop-opacity='0.1'/%3E%3Cstop offset='0.369792' stop-opacity='0.0326087'/%3E%3Cstop offset='0.581127' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A");
        }
      `;
    }
  }}
`;

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export default React.memo(React.forwardRef(TabList));
