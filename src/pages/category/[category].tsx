import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';
import axios from 'axios';
import { Obj } from '@model/index';
import { CATEGORY } from '@constants/search';
import { CATEGROY_TITLE_MAP } from '@constants/menu';

const CategoryPage = ({ menuList, title }: any) => {
  console.log(menuList, 'menuList');
  return (
    <Container>
      <SingleMenu menuList={menuList} title={CATEGROY_TITLE_MAP[title]} />
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
  console.log(paths, 'paths');
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
  console.log(params.category, 'params.category');
  const query = {
    menuSort: 'LAUNCHED_DESC',
    type: isAll ? '' : categoryTypeMap[params.category],
  };

  console.log(query, 'query');

  const { data } = await axios(`${process.env.API_URL}/menu/v1/menus`, { params: query });

  return {
    props: { menuList: data.data, title: params.category },
    revalidate: 100,
  };
}

export default CategoryPage;
