import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ItemListCol } from '@styles/theme';
import axios from 'axios';
import Item from '@components/Item';
import CategoryFilter from '@components/CategoryFilter';

function SingleMenu({ category }: any) {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    const { data } = await axios.get(
      'https://gist.githubusercontent.com/dongha1992/7780e6a89c3feb8ffab266a8b9e34f12/raw/2088b0c308d7f0c9350e0109b4c78cee8bcfb73e/items.json'
    );
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
