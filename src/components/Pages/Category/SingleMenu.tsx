import React from 'react';
import styled from 'styled-components';
import { FlexWrapWrapper } from '@styles/theme';
import { Item } from '@components/Item';
import { TextH3B } from '@components/Shared/Text';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { IMenus } from '@model/index';

const SingleMenu = ({ title }: any) => {
  const {
    data,
    error: menuError,
    isLoading,
  } = useQuery<IMenus[]>(
    'getMenus',
    async () => {
      const params = { categories: '', menuSort: 'LAUNCHED_DESC', searchKeyword: '', type: 'SALAD' };
      const { data } = await getMenusApi(params);
      return data.data;
    },

    {
      onSuccess: (data) => {
        return data;
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <TextH3B padding="0 0 17px 0">{title || '전체'}</TextH3B>
      <FlexWrapWrapper>
        {data?.map((item: any, index: number) => {
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

export default React.memo(SingleMenu);
