import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ItemListCol } from '@styles/theme';
import axios from 'axios';
import Item from '@components/Item';
import CategoryFilter from '@components/Pages/Category/CategoryFilter';
import { BASE_URL } from '@constants/mock';

function SingleMenu({ category }: any) {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data);
  };

  return (
    <Container>
      <CategoryFilter title={category} />
      <ItemListCol>
        {itemList.length > 0 &&
          itemList.map((item: any, index: number) => {
            return <Item item={item} key={index} />;
          })}
      </ItemListCol>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

export default React.memo(SingleMenu);
