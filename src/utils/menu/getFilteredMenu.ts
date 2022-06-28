import cloneDeep from 'lodash-es/cloneDeep';
import { IMenus, Obj } from '@model/index';

interface IFilter {
  order: string;
  filter: string[];
}
interface IProps {
  categoryFilters: IFilter | null;
  menus: IMenus[];
}
const getFilteredMenus = ({ menus, categoryFilters }: IProps) => {
  try {
    let copiedMenuList = cloneDeep(menus);
    const hasCategory = categoryFilters?.filter && categoryFilters?.filter?.filter((i) => i).length !== 0;

    if (hasCategory) {
      copiedMenuList = copiedMenuList.filter((menu: Obj) => categoryFilters?.filter.includes(menu.category));
    }

    if (!categoryFilters?.order) {
      return copiedMenuList;
    } else {
      switch (categoryFilters?.order) {
        case '': {
          return menus;
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
          return menus;
      }
    }
  } catch (error) {
    console.error(error);
    return menus;
  }
};

export const getPriceOrder = (list: IMenus[], order: 'max' | 'min') => {
  const mapped = list?.map((menu: IMenus) => {
    const prices = menu?.menuDetails?.map((item) => item.price);
    return { ...menu, [order]: Math[order](...prices) };
  });

  return mapped.sort((a: any, b: any) => {
    const isMin = order === 'min';
    return isMin ? a[order] - b[order] : b[order] - a[order];
  });
};

const reorderedMenusBySoldout = (menuList: IMenus[]) => {
  return menuList?.sort((a: any, b: any) => {
    return (
      a?.menuDetails?.every((menu: IMenus) => menu.isSold) - b?.menuDetails?.every((menu: IMenus) => menu.isSold) ||
      a.isSold - b.isSold
    );
  });
};

export { reorderedMenusBySoldout, getFilteredMenus };
