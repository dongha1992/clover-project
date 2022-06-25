import React from 'react';
import styled from 'styled-components';
import { homePadding } from '@styles/theme';
import { TextH6B, TextH3B } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import dynamic from 'next/dynamic';

const MenuFilter = dynamic(() => import('@components/Filter/MenuFilter'));

const CategoryFilter = () => {
  const dispatch = useDispatch();

  const clickFilterHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <MenuFilter />,
      })
    );
  };
  return (
    <PageTitleWrapper>
      <CategroyTabWrapper>
        <SVGIcon name="filter" />
        <TextH6B padding="0 0 0 4px" onClick={clickFilterHandler} pointer>
          필터 및 정렬
        </TextH6B>
      </CategroyTabWrapper>
    </PageTitleWrapper>
  );
};

const CategroyTabWrapper = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: white;
  width: 100%;
`;

const PageTitleWrapper = styled.div``;

export default React.memo(CategoryFilter);
