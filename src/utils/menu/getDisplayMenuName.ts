import { pipe, map, join, find } from '@fxts/core';

const getDisplayMenuName = (orderMenus: any) => {
  const { menuDetailName, menuName }: { menuDetailName: string; menuName: string } = pipe(
    orderMenus,
    find((item: any) => item.main)
  );
  return { menuName: `${menuName} / ${menuDetailName} 외 ${orderMenus.length - 1}개` };
};

export default getDisplayMenuName;
