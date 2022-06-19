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
import { SET_CATEGORY_MENU } from '@store/menu';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { useRouter } from 'next/router';
import { IAllMenus } from '@components/Pages/Category/SingleMenu';
import { cloneDeep } from 'lodash-es';

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
  // const [isFilter, setIsFilter] = useState<boolean>(false);
  const [defaultMenus, setDefaultMenus] = useState<IMenus[]>();
  const router = useRouter();

  const dispatch = useDispatch();
  const { categoryFilters, type } = useSelector(filterSelector);

  const isAllMenu = type === 'all';

  const isFilter = categoryFilters?.order || categoryFilters?.filter;

  const formatType = categoryTypeMap[type] ? categoryTypeMap[type] : '';
  const types = typeof formatType === 'string' ? formatType : formatType.join(',');

  const { error: menuError, isLoading } = useQuery(
    ['getMenus', type],
    async ({ queryKey }) => {
      const params = {
        categories: '',
        menuSort: '',
        type: types,
      };

      const { data } = await getMenusApi(params);
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!type,
      onError: () => {},
      onSuccess: (data) => {
        const reOrdered = checkIsSold(data);
        checkIsFiltered(reOrdered);
        setDefaultMenus(reOrdered);
      },
    }
  );

  const checkIsSold = (menuList: IMenus[]) => {
    return menuList?.sort((a: any, b: any) => {
      return a.isSold - b.isSold;
    });
  };

  const checkIsFiltered = (menuList: IMenus[]) => {
    if (isFilter) {
      const filered = filteredMenus(menuList);
      checkIsAllMenus(filered!);
    } else {
      checkIsAllMenus(menuList);
    }
  };

  const checkIsAllMenus = (menuList: IMenus[]) => {
    if (isAllMenu) {
      const grouped = groupByMenu(menuList, 'type');
      setAllMenus({ ...grouped });
      setMenus([]);
    } else {
      setMenus(menuList);
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

  const filteredMenus = (menuList: IMenus[]) => {
    try {
      let copiedMenuList = cloneDeep(menuList);
      const hasCategory = categoryFilters?.filter?.filter((i) => i).length !== 0;

      if (hasCategory) {
        copiedMenuList = copiedMenuList.filter((menu: Obj) => categoryFilters?.filter.includes(menu.category));
      }

      if (!categoryFilters?.order) {
        return copiedMenuList;
      } else {
        switch (categoryFilters?.order) {
          case '': {
            return menuList;
          }
          case 'ORDER_COUNT_DESC': {
            return copiedMenuList.sort((a, b) => b.orderCount - a.orderCount);
          }
          case 'LAUNCHED_DESC': {
            return copiedMenuList.sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());
          }
          case 'PRICE_DESC': {
            return getPriceOrder(copiedMenuList, 'max');
          }
          case 'PRICE_ASC': {
            return getPriceOrder(copiedMenuList, 'min');
          }
          case 'REVIEW_COUNT_DESC': {
            return copiedMenuList.sort((a, b) => b.reviewCount - a.reviewCount);
          }
          default:
            return menuList;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPriceOrder = (list: IMenus[], order: 'max' | 'min') => {
    const mapped = list?.map((menu: IMenus) => {
      const prices = menu?.menuDetails?.map((item) => item.price);
      return { ...menu, [order]: Math[order](...prices) };
    });

    return mapped.sort((a: any, b: any) => {
      const isMin = order === 'min';
      return isMin ? a[order] - b[order] : b[order] - a[order];
    });
  };

  useEffect(() => {
    if (categoryFilters?.order || categoryFilters?.filter) {
      checkIsFiltered(defaultMenus!);
    }
  }, [categoryFilters]);

  if (isLoading) {
    return <div>로딩 중</div>;
  }

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

export default CategoryPage;
