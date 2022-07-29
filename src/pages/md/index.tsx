import React from 'react';
import styled from 'styled-components';
import { textH3, homePadding, theme, FlexWrapWrapper } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { useQuery } from 'react-query';
import { getRecommendMenusApi } from '@api/menu';
import { Item } from '@components/Item';

// MD 추천 
const MdRecommandPage = () => {
  const {
    data: menus,
    error: menuError,
    isLoading,
  } = useQuery(
    'getRecommendMenus',
    async () => {
      const { data } = await getRecommendMenusApi();
      return data.data.sort((a: any, b: any) => a.isSold - b.isSold);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  if(isLoading){
    return <div>로딩</div>;
  };
    
  return (
    <Container>
      <FlexWrapWrapper>
        {
          menus?.length! > 0
            ? menus?.map((item, index) => {
              return <Item item={item} key={index} />;
              })
            : '상품을 준비 중입니다.'
        }
      </FlexWrapWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 24px;
`;

export default MdRecommandPage;
