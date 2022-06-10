import { getLikeMenus } from '@api/menu';
import { Item } from '@components/Item';
import { SubsItem } from '@components/Pages/Subscription';
import { FlexWrapWrapper } from '@styles/theme';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const GeneralDibPage = () => {
  const { data: likeMenus, isLoading } = useQuery(
    ['getLikeMenus', 'GENERAL'],
    async () => {
      const { data } = await getLikeMenus('GENERAL');

      return data.data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  if (isLoading) return <div>...로딩중</div>;

  return (
    <Container>
      <FlexWrapWrapper>
        {likeMenus?.map((item: any, index: number) => {
          return <Item item={item} key={index} />;
        })}
      </FlexWrapWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 74px 24px 26px;
`;

export default GeneralDibPage;
