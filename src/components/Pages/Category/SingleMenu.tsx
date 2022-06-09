import React from 'react';
import styled from 'styled-components';
import { FlexWrapWrapper } from '@styles/theme';
import { Item } from '@components/Item';
import { TextH3B } from '@components/Shared/Text';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { IMenus } from '@model/index';

export interface IAllMenus {
  DRINK?: IMenus[];
  KOREAN_SOUP?: IMenus[];
  SOUP?: IMenus[];
  LUNCH_BOX?: IMenus[];
  CONVENIENCE_FOOD?: IMenus[];
  SALAD?: IMenus[];
  SET?: IMenus[];
  SNACK?: IMenus[];
  WRAP?: IMenus[];
  SANDWICH?: IMenus[];
}
interface IProps {
  menuList: IMenus[];
  title: string;
  isAllMenu?: boolean;
  allMenus?: IAllMenus;
}

const SingleMenu = ({ menuList, title, isAllMenu, allMenus }: IProps) => {
  console.log(menuList, 'menuList');
  console.log(allMenus, 'allMenus');

  if (menuList.length < 0) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      {!isAllMenu ? <TextH3B padding="0 0 17px 0">{title}</TextH3B> : ''}
      {!isAllMenu ? (
        <FlexWrapWrapper>
          {menuList?.map((item: any, index: number) => {
            return <Item item={item} key={index} />;
          })}
        </FlexWrapWrapper>
      ) : (
        <>
          <TextH3B padding="0 0 17px 0">샐러드</TextH3B>
          <FlexWrapWrapper>
            {allMenus?.SALAD?.map((item, index) => {
              return <Item item={item} key={index} />;
            })}
          </FlexWrapWrapper>
          <TextH3B padding="0 0 17px 0">샐러드</TextH3B>
          <FlexWrapWrapper>
            {allMenus?.SALAD?.map((item, index) => {
              return <Item item={item} key={index} />;
            })}
          </FlexWrapWrapper>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-top: 42px;
`;

const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export default SingleMenu;
