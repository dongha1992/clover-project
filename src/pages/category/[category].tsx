import React, { useEffect, useState, useCallback } from 'react';
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
import { useRouter } from 'next/router';
import { IAllMenus } from '@components/Pages/Category/SingleMenu';

/* TODO: 로그인 체크 알림신청 */
/* TODO: 메뉴 디테일 메뉴 이미지 삭제 */
const categoryTypeMap: Obj = {
  meal: ['CONVENIENCE_FOOD', 'LUNCH_BOX'],
  drink: 'DRINK',
  soup: ['KOREAN_SOUP', 'SOUP'],
  salad: 'SALAD',
  wrap: ['SANDWICH', 'WRAP'],
  set: 'SET',
  snack: 'SNACK',
  subscription: 'SUBSCRIPTION',
};

const CategoryPage = () => {
  const [menus, setMenus] = useState<IMenus[]>();
  const [allMenus, setAllMenus] = useState<IAllMenus>({
    DRINK: [],
    KOREAN_SOUP: [],
    SOUP: [],
    LUNCH_BOX: [],
    CONVENIENCE_FOOD: [],
    SALAD: [],
    SET: [],
    SNACK: [],
    WRAP: [],
    SANDWICH: [],
  });

  const router = useRouter();

  const dispatch = useDispatch();
  const {
    categoryFilters: { filter, order },
    type,
  } = useSelector(filterSelector);

  const isAllMenu = type === 'all';

  const hasFilter = filter.filter((item) => item).length !== 0 || order.length > 0;

  const getMenuList = async (types: string) => {
    const params = {
      categories: '',
      menuSort: '',
      type: types,
    };
    try {
      const { data } = await getMenusApi(params);
      reorderMenuList(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getfilteredMenuList = async (types: string) => {
    const params = {
      categories: filter.join(','),
      menuSort: order,
      type: types,
    };
    try {
      const { data } = await getMenusApi(params);
      reorderMenuList(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const reorderMenuList = (menuList: IMenus[]) => {
    const reordered = menuList.sort((a: any, b: any) => {
      return a.isSold - b.isSold;
    });
    if (isAllMenu) {
      const grouped = groupByMenu(reordered, 'type');
      setAllMenus({ ...allMenus, ...grouped });
      setMenus([]);
    } else {
      setMenus(reordered);
      setAllMenus({});
    }
  };

  const groupByMenu = (list: IMenus[], key: string) => {
    return list.reduce((obj: Obj, menu: any) => {
      let group = menu[key];

      if (group === 'SUBSCRIPTION') {
        return obj;
      }

      if (obj[group] === undefined) {
        obj[group] = [];
      }
      obj[group].push(menu);
      return obj;
    }, {});
  };

  useEffect(() => {
    const formatType = categoryTypeMap[type] ? categoryTypeMap[type] : '';
    const types = typeof formatType === 'string' ? formatType : formatType.join(',');

    if (router.isReady) {
      if (hasFilter) {
        getfilteredMenuList(types);
      } else {
        getMenuList(types);
      }
    }
  }, [type, order, filter]);

  return (
    <Container>
      <SingleMenu
        menuList={menus || []}
        title={CATEGORY_TITLE_MAP[type as string]}
        isAllMenu={isAllMenu}
        allMenus={allMenus}
      />
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
//     meal: ['CONVENIENCE_FOOD', 'LUNCH_BOX'],
//     drink: 'DRINK',
//     soup: ['KOREAN_SOUP', 'SOUP'],
//     salad: 'SALAD',
//     wrap: ['SANDWICH', 'WRAP'],
//     set: 'SET',
//     snack: 'SNACK',
//     subscription: 'SUBSCRIPTION',
//   };
//   const formatType = categoryTypeMap[params.category] ? categoryTypeMap[params.category] : '';

//   return {
//     props: { title: params.category, type: formatType },
//     revalidate: 100,
//   };
// }

export default CategoryPage;
