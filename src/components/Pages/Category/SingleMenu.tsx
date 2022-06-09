import React from 'react';
import styled from 'styled-components';
import { FlexWrapWrapper } from '@styles/theme';
import { Item } from '@components/Item';
import { TextH3B } from '@components/Shared/Text';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { IMenus } from '@model/index';

const SingleMenu = ({ menuList, title }: any) => {
  console.log(menuList, 'menuList');
  // if (menuList && menuList.length < 0) {
  //   return <div>로딩중</div>;
  // }

  return (
    <Container>
      <TextH3B padding="0 0 17px 0">{title || '전체'}</TextH3B>
      <FlexWrapWrapper>
        {menuList?.map((item: any, index: number) => {
          return <Item item={item} key={index} />;
        })}
      </FlexWrapWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-top: 42px;
`;

export default SingleMenu;
