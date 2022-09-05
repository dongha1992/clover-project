import { FlexBetween, FlexEnd, FlexWrapWrapper } from '@styles/theme';
import styled from 'styled-components';
import { Skeleton } from '.';
import { MenuBox } from './HomeSkeleton';

const CategorySkeleton = () => {
  return (
    <Container>
      <FlexEnd padding="18px 0 8px">
        <Skeleton width="78px" height="18px" />
      </FlexEnd>
      <Skeleton width="67px" height="27px" margin="0 0 24px" />
      <FlexWrapWrapper margin="0 0 24px">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((id) => (
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
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  padding: 48px 24px 24px 24px;
`;
export default CategorySkeleton;
