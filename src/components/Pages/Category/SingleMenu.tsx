import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FlexWrapWrapper } from '@styles/theme';
import axios from 'axios';
import { Item } from '@components/Item';
import { CategoryFilter } from '@components/Pages/Category';
import { BASE_URL } from '@constants/mock';

const SingleMenu = ({ category }: any) => {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data.data);
  };

  return (
    <Container>
      <CategoryFilter title={category} />
      <FlexWrapWrapper>
        {itemList.length > 0 &&
          itemList.map((item: any, index: number) => {
            return <Item item={item} key={index} />;
          })}
      </FlexWrapWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

export default React.memo(SingleMenu);
