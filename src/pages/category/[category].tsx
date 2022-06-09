import React, { useEffect, useState } from 'react';
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
import { useRouter } from 'next/router';

const CategoryPage = () => {
  const [menus, setMenus] = useState();
  const router = useRouter();
  const { category }: { category: string } = router.query;
  const dispatch = useDispatch();
  const {
    categoryFilters: { filter, order },
  } = useSelector(filterSelector);

  const hasCategoryFilter = filter.length > 0 || order;

  const {
    data,
    error: menuError,
    isLoading,
  } = useQuery(
    ['getMenus', hasCategoryFilter],
    async () => {
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

      const isAll = category === 'all';
      const types = categoryTypeMap[category] as string;

      const params = {
        categories: filter.join(','),
        menuSort: order,
        type: isAll ? '' : types,
      };
      const { data } = await getMenusApi(params);
      return data.data;
    },
    {
      onSuccess: () => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!category,
    }
  );

  console.log(category, '2');
  useEffect(() => {}, []);

  return (
    <Container>
      <SingleMenu menuList={menus} title={1} />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

// export async function getStaticPaths() {
//   const paths = CATEGORY.map((menu: any) => ({
//     params: { category: menu.value },
//   }));

//   return {
//     paths,
//     fallback: false,
//   };
// }

// export async function getStaticProps({ params }: { params: { category: string } }) {
//   const categoryTypeMap: Obj = {
//     meal: 'CONVENIENCE_FOOD',
//     drink: 'DRINK',
//     soup: 'KOREAN_SOUP',
//     // meal: 'LUNCH_BOX',
//     salad: 'SALAD',
//     wrap: 'SANDWICH',
//     package: 'SET',
//     snack: 'SNACK',
//     // soup: 'SOUP',
//     subscription: 'SUBSCRIPTION',
//     // wrap: 'WRAP',
//   };

//   const isAll = params.category === 'all';
//   const types = categoryTypeMap[params.category];
//   const query = {
//     menuSort: 'ORDER_COUNT_DESC',
//     type: isAll ? '' : types,
//   };

//   const { data } = await axios(`${process.env.API_URL}/menu/v1/menus`, { params: query });

//   return {
//     props: { menuList: data.data, title: params.category, type: types ? types : null },
//     revalidate: 100,
//   };
// }

export default CategoryPage;
