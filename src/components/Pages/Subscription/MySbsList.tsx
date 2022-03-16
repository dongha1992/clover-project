import { TextH3B, TextH6B } from '@components/Shared/Text';
import { ScrollHorizonList, theme } from '@styles/theme';
import { useState } from 'react';
import styled from 'styled-components';
import SbsCardItem from './SbsCardItem';

const MySbsList = () => {
  // TODO : 구독 리스트 api 추후 리액트 쿼리로 변경
  const [subsList, setSubsList] = useState([{}, {}, {}]);
  return (
    <MySbsBox>
      <Head>
        <TextH3B>내 구독 ({subsList.length})</TextH3B>
        <TextH6B color={theme.greyScale65} pointer textDecoration="underline">
          구독 관리
        </TextH6B>
      </Head>
      <ScrollHorizonList style={{ backgroundColor: theme.greyScale3 }}>
        <ListContainer>
          {subsList.map((item, index) => (
            <SbsCardItem key={index} />
          ))}
        </ListContainer>
      </ScrollHorizonList>
    </MySbsBox>
  );
};
const MySbsBox = styled.div`
  padding-bottom: 56px;
`;
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
`;
const ListContainer = styled.div`
  display: flex;

  padding: 24px;
  background-color: ${theme.greyScale3};
`;

export default MySbsList;
