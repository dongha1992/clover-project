import React from 'react';
import styled from 'styled-components';
import { homePadding } from '@styles/theme';
import { TextH6B, TextH3B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import dynamic from 'next/dynamic';

const MenuFilter = dynamic(() => import('@components/Filter/MenuFilter'));

const CategoryFilter = ({ title }: any) => {
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
      <CategroyTabWrapper onClick={clickFilterHandler}>
        <SVGIcon name="filter" />
        <TextH6B padding="0 0 0 4px">필터 및 정렬</TextH6B>
      </CategroyTabWrapper>
      <TextH3B padding="0 0 17px 0">{title ? title : '전체'}</TextH3B>
    </PageTitleWrapper>
  );
};

const CategroyTabWrapper = styled.div`
  margin: 18px 0px 6px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const PageTitleWrapper = styled.div`
  ${homePadding}
`;

export default React.memo(CategoryFilter);
