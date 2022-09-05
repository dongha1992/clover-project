import { FlexBetween, FlexBetweenStart, FlexCol, FlexColStart, FlexRow } from '@styles/theme';
import styled from 'styled-components';
import { ItemBox, ItemList, Skeleton } from './index';

interface IProps {
  me: any;
}

const SubsMainSkeleton = ({ me }: IProps) => {
  return (
    <Container>
      <FlexCol padding="24px 24px 46px">
        <Skeleton width="183px" height="30px" margin="0 0 2px" />
        <Skeleton width="183px" height="30px" margin="0 0 2px" />
      </FlexCol>
      {me && (
        <MySubsList>
          <FlexBetween padding="0 24px 16px">
            <Skeleton width="50px" height="22px" />
            <Skeleton width="50px" height="22px" />
          </FlexBetween>
          <FlexRow padding="24px">
            <Skeleton width="100%" height="124px" />
          </FlexRow>
        </MySubsList>
      )}
      {[0, 1].map((id) => (
        <div key={id}>
          <FlexBetweenStart padding="0 24px 24px">
            <FlexColStart>
              <Skeleton width="134px" height="27px" margin="0 0 8px" />
              <Skeleton width="231px" height="22px" />
            </FlexColStart>
            <Skeleton width="38px" height="18px" margin="0 0 2px" />
          </FlexBetweenStart>
          <ItemList>
            {[0, 1, 2].map((id) => (
              <ItemBox key={id}>
                <Skeleton width="298px" height="168px" margin="0 0 8px" />
                <Skeleton width="195px" height="22px" margin="0 0 4px" />
                <Skeleton width="298px" height="18px" margin="0 0 8px" />
                <Skeleton width="76px" height="22px" />
              </ItemBox>
            ))}
          </ItemList>
        </div>
      ))}
      <Skeleton width="100%" height="92px" />
    </Container>
  );
};

const Container = styled.div`
  padding: 0 0 48px;
  overflow: hidden;
`;

const MySubsList = styled.div`
  margin-bottom: 48px;
`;

export default SubsMainSkeleton;
