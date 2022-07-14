import React from 'react';
import styled from 'styled-components';
import { FlexWrapWrapper } from '@styles/theme';
import { Item } from '@components/Item';
import { TextH3B } from '@components/Shared/Text';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { IMenus } from '@model/index';
import { getFilteredMenus, reorderedMenusBySoldout } from '@utils/menu';
import { useSelector } from 'react-redux';
import { filterSelector } from '@store/filter';
import { Empty } from '@components/Pages/Category';

export interface IAllMenus {
  DRINK?: IMenus[];
  KOREAN_SOUP?: IMenus[];
  SOUP?: IMenus[];
  LUNCH_BOX?: IMenus[];
  CONVENIENCE_FOOD?: IMenus[];
  SALAD?: IMenus[];
  SET?: IMenus[];
  SNACK?: IMenus[];
  WRAP?: IMenus[];
  SANDWICH?: IMenus[];
}
interface IProps {
  menuList: IMenus[];
  title: string;
  isAllMenu?: boolean;
  allMenus?: IAllMenus;
}

const SingleMenu = ({ menuList, title, isAllMenu, allMenus }: IProps) => {
  const { categoryFilters } = useSelector(filterSelector);

  const wrapAndSandwich = [...(allMenus?.SANDWICH ?? []), ...(allMenus?.WRAP ?? [])];
  const lunchAndConvenienceFood = [...(allMenus?.LUNCH_BOX ?? []), ...(allMenus?.CONVENIENCE_FOOD ?? [])];
  const soups = [...(allMenus?.KOREAN_SOUP ?? []), ...(allMenus?.SOUP ?? [])];

  if (menuList.length < 0) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      {!isAllMenu ? <TextH3B padding="0 0 17px 0">{title}</TextH3B> : ''}
      {!isAllMenu ? (
        <FlexWrapWrapper>
          {menuList?.length! > 0 ? (
            menuList?.map((item: any, index: number) => {
              return <Item item={item} key={index} />;
            })
          ) : (
            <Empty />
          )}
        </FlexWrapWrapper>
      ) : (
        <>
          {allMenus?.SALAD?.length! > 0 && (
            <>
              <TextH3B padding="17px 0 17px 0">샐러드</TextH3B>
              <FlexWrapWrapper>
                {allMenus?.SALAD?.map((item, index) => {
                  return <Item item={item} key={index} />;
                })}
              </FlexWrapWrapper>
            </>
          )}
          {wrapAndSandwich.length > 0 && (
            <>
              <TextH3B padding="17px 0 17px 0">랩·샌드위치</TextH3B>
              <FlexWrapWrapper>
                {reorderedMenusBySoldout(
                  getFilteredMenus({
                    menus: wrapAndSandwich,
                    categoryFilters,
                  })
                )?.map((item, index) => {
                  return <Item item={item} key={index} />;
                })}
              </FlexWrapWrapper>
            </>
          )}

          {lunchAndConvenienceFood.length > 0 && (
            <>
              <TextH3B padding="17px 0 17px 0">도시락·간편식</TextH3B>
              <FlexWrapWrapper>
                {reorderedMenusBySoldout(
                  getFilteredMenus({
                    menus: lunchAndConvenienceFood,
                    categoryFilters,
                  })
                )?.map((item, index) => {
                  return <Item item={item} key={index} />;
                })}
              </FlexWrapWrapper>
            </>
          )}

          {soups.length > 0 && (
            <>
              <TextH3B padding="17px 0 17px 0">죽·스프</TextH3B>
              <FlexWrapWrapper>
                {reorderedMenusBySoldout(
                  getFilteredMenus({
                    menus: soups,
                    categoryFilters,
                  })
                )?.map((item, index) => {
                  return <Item item={item} key={index} />;
                })}
              </FlexWrapWrapper>
            </>
          )}
          {allMenus?.SET?.length! > 0 && (
            <>
              <TextH3B padding="17px 0 17px 0">세트상품</TextH3B>
              <FlexWrapWrapper>
                {allMenus?.SET?.map((item, index) => {
                  return <Item item={item} key={index} />;
                })}
              </FlexWrapWrapper>
            </>
          )}
          {allMenus?.SNACK?.length! > 0 && (
            <>
              <TextH3B padding="17px 0 17px 0">간식</TextH3B>
              <FlexWrapWrapper>
                {allMenus?.SNACK?.map((item, index) => {
                  return <Item item={item} key={index} />;
                })}
              </FlexWrapWrapper>
            </>
          )}
          {allMenus?.DRINK?.length! > 0 && (
            <>
              <TextH3B padding="17px 0 17px 0">음료</TextH3B>
              <FlexWrapWrapper>
                {allMenus?.DRINK?.map((item, index) => {
                  return <Item item={item} key={index} />;
                })}
              </FlexWrapWrapper>
            </>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-top: 42px;
`;

const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export default React.memo(SingleMenu);
