import React, { useEffect } from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';
import axios from 'axios';
import { Obj } from '@model/index';
import { CATEGORY } from '@constants/search';
import { CATEGORY_TITLE_MAP } from '@constants/menu';
import { useSelector, useDispatch } from 'react-redux';
import { INIT_CATEGORY_FILTER, filterSelector } from '@store/filter';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { isNil } from 'lodash-es';

const CategoryPage = ({ menuList, title, type }: any) => {
  const dispatch = useDispatch();
  const {
    categoryFilters: { filter, order },
  } = useSelector(filterSelector);

  const hasCategoryFilter = filter.length > 0 || order;
  console.log(hasCategoryFilter, 'categoryFilters');
  const {
    data: menus,
    error: menuError,
    isLoading,
  } = useQuery(
    ['getMenus', hasCategoryFilter],
    async () => {
      const params = {
        categories: filter.join(','),
        menuSort: order,
        type,
      };
      const { data } = await getMenusApi(params);
      return data.data;
    },
    {
      onSuccess: () => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!hasCategoryFilter,
    }
  );

  console.log(menus, 'menus');

  return (
    <Container>
      <SingleMenu menuList={menuList} title={CATEGORY_TITLE_MAP[title]} />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export async function getStaticPaths() {
  const paths = CATEGORY.map((menu: any) => ({
    params: { category: menu.value },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { category: string } }) {
  const categoryTypeMap: Obj = {
    meal: 'CONVENIENCE_FOOD',
    drink: 'DRINK',
    soup: 'KOREAN_SOUP',
    // meal: 'LUNCH_BOX',
    salad: 'SALAD',
    wrap: 'SANDWICH',
    package: 'SET',
    snack: 'SNACK',
    // soup: 'SOUP',
    subscription: 'SUBSCRIPTION',
    // wrap: 'WRAP',
  };

  const isAll = params.category === 'all';
  const types = categoryTypeMap[params.category];
  const query = {
    menuSort: 'LAUNCHED_DESC',
    type: isAll ? '' : types,
  };

  const { data } = await axios(`${process.env.API_URL}/menu/v1/menus`, { params: query });

  return {
    props: { menuList: data.data, title: params.category, type: types ? types : null },
    revalidate: 100,
  };
}

export default CategoryPage;
