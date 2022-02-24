import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FlexWrapWrapper } from '@styles/theme';
import axios from 'axios';
import { Item } from '@components/Item';
import { TextH3B } from '@components/Shared/Text';

import { BASE_URL } from '@constants/mock';

const SingleMenu = ({ title }: any) => {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    const { data } = await axios.get(`${BASE_URL}/itemList`);
    setItemList(data.data);
  };

  return (
    <Container>
      <TextH3B padding="0 0 17px 0">{title}</TextH3B>
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
  margin-top: 42px;
`;

export default React.memo(SingleMenu);
