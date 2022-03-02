import React from 'react';
import styled from 'styled-components';
import { FlexWrapWrapper } from '@styles/theme';
import { Item } from '@components/Item';
import { TextH3B } from '@components/Shared/Text';

const SingleMenu = ({ title, data }: any) => {
  return (
    <Container>
      <TextH3B padding="0 0 17px 0">{title}</TextH3B>
      <FlexWrapWrapper>
        {data?.map((item: any, index: number) => {
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
