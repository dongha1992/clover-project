import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextH6B } from '@components/Shared/Text';
import { homePadding, theme } from '@styles/theme';
import RecentSearchItem from './RecentSearchItem';

const RecentSearch = ({
  removeRecentSearchItemHandler,
  recentKeywords,
}: any) => {
  return (
    <Container>
      <Header>
        <TextH5B>최근검색어</TextH5B>
        <TextH6B color={theme.greyScale65} textDecoration="underline" pointer>
          전체삭제
        </TextH6B>
      </Header>
      <ListContainer>
        {recentKeywords &&
          recentKeywords.map((keyword: any, index: number) => (
            <RecentSearchItem
              key={index}
              keyword={keyword}
              onClick={removeRecentSearchItemHandler}
            />
          ))}
      </ListContainer>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  ${homePadding}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  margin-bottom: 8px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default React.memo(RecentSearch);
