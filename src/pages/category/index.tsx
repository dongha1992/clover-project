import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { IMenus } from '@model/index';

const CategoryPage = () => {
  const {
    data: saldMenus,
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
      <SingleMenu data={saldMenus} />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default React.memo(CategoryPage);
