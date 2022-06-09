import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';
import axios from 'axios';
import { Obj, IMenus } from '@model/index';
import { CATEGORY } from '@constants/search';
import { CATEGORY_TITLE_MAP } from '@constants/menu';
import { useSelector, useDispatch } from 'react-redux';
import { INIT_CATEGORY_FILTER, filterSelector } from '@store/filter';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { isNil } from 'lodash-es';
import { useRouter } from 'next/router';

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

/* TODO: 로그인 체크 알림신청 */
/* TODO: 메뉴 디테일 메뉴 이미지 삭제 */

interface IProps {
  title: string;
  type: string | string[];
}

const CategoryPage = ({ title, type }: IProps) => {
  const [menus, setMenus] = useState<IMenus[]>();
  const router = useRouter();

  const dispatch = useDispatch();
  const {
    categoryFilters: { filter, order },
  } = useSelector(filterSelector);

  const isAll = type === 'all';
  const types = typeof type === 'string' ? type : type.join(',');

  const getMenuList = async () => {
    const params = {
      categories: filter.join(','),
      menuSort: order,
      type: isAll ? '' : types,
    };
    const { data } = await getMenusApi(params);
    reorderMenuList(data.data);
  };

  const reorderMenuList = (menuList: IMenus[]) => {
    const reordered = menuList.sort((a: any, b: any) => {
      return a.isSold - b.isSold;
    });
    setMenus(reordered);
  };
  useEffect(() => {
    getMenuList();
  }, [type, filter, order]);

  return (
    <Container>
      <SingleMenu menuList={menus || []} title={CATEGORY_TITLE_MAP[title as string]} />
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
    meal: ['CONVENIENCE_FOOD', 'LUNCH_BOX'],
    drink: 'DRINK',
    soup: ['KOREAN_SOUP', 'SOUP'],
    salad: 'SALAD',
    wrap: ['SANDWICH', 'WRAP'],
    package: 'SET',
    snack: 'SNACK',
    subscription: 'SUBSCRIPTION',
  };

  const types = categoryTypeMap[params.category];

  return {
    props: { title: params.category, type: types ? types : null },
    revalidate: 100,
  };
}

export default CategoryPage;
