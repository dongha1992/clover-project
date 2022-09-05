import { FlexBetween, FlexCol, FlexWrapWrapper } from '@styles/theme';
import styled from 'styled-components';
import { ItemBox, ItemList, Skeleton } from '.';

const HomeSkeleton = () => {
  return (
    <Container>
      <Skeleton width="100%" height="75vw" className="banner1" />
      <FlexBetween padding="24px">
        {[0, 1, 2, 3].map((id) => (
          <FlexCol key={id}>
            <Skeleton width="80px" height="80px" margin="0 0 12px" className="round" />
            <Skeleton width="56px" height="22px" margin="0 auto" />
          </FlexCol>
        ))}
      </FlexBetween>
      <FlexBetween padding="24px">
        <Skeleton width="67px" height="27px" />
        <Skeleton width="38px" height="18px" />
      </FlexBetween>

      <FlexWrapWrapper padding="0 24px" margin="0 0 24px">
        {[0, 1, 2, 3].map((id) => (
          <MenuBox key={id}>
            <Skeleton width="100%" height="42.9688vw" className="menuImg" />
            <Skeleton width="100%" height="22px" margin="0 0 2px" />
            <Skeleton width="75px" height="22px" margin="0 0 8px" />
            <Skeleton width="100%" height="18px" margin="0 0 2px" />
            <Skeleton width="100%" height="18px" margin="0 0 8px" />
            <FlexBetween margin="0 0 8px">
              <Skeleton width="39px" height="18px" />
              <Skeleton width="39px" height="18px" />
            </FlexBetween>
            <Skeleton width="75px" height="19px" />
          </MenuBox>
        ))}
      </FlexWrapWrapper>
      <Skeleton width="100%" height="92px" margin="0 0 48px" />
      <FlexBetween padding="0 24px 24px">
        <Skeleton width="164px" height="27px" />
        <Skeleton width="38px" height="18px" />
      </FlexBetween>
      <Skeleton width="100%" height="56.0547vw" className="banner2" margin="0 0 24px" />
      <ItemList>
        {[0, 1, 2].map((id) => (
          <ItemBox key={id}>
            <Skeleton width="132px" height="132px" margin="0 0 8px" />
            <Skeleton width="132px" height="22px" margin="0 0 2px" />
            <Skeleton width="98px" height="18px" margin="0 0 3px" />
            <Skeleton width="44px" height="18px" />
          </ItemBox>
        ))}
      </ItemList>
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  overflow: hidden;
  .banner1 {
    max-height: 384px;
  }
  .banner2 {
    max-height: 287px;
  }
  .round {
    border-radius: 56px;
  }
`;

export const MenuBox = styled.div`
  display: inline-block;
  position: relative;
  width: 48%;
  height: auto;
  max-width: 220px;
  max-height: 380px;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
  cursor: pointer;
  .menuImg {
    max-height: 220px;
    margin-bottom: 8px;
  }
`;

export default HomeSkeleton;
