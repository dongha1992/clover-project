import { FlexCol, FlexRowStart } from '@styles/theme';
import styled from 'styled-components';
import { ItemBox, ItemList, Skeleton } from '.';

const SpotSkeleton = () => {
  return (
    <Container>
      <FlexCol padding="24px 24px 48px">
        <Skeleton width="183px" height="30px" margin="0 0 2px" />
        <Skeleton width="173px" height="30px" margin="0 0 14px" />
        <Skeleton width="124px" height="26px" borderRadius="100px" />
      </FlexCol>

      {[0, 1].map((id) => (
        <ListBox key={id}>
          <Skeleton width="164px" height="27px" margin="0 0 24px 24px" />
          <ItemList>
            {[0, 1, 2, 3].map((id) => (
              <ItemBox key={id}>
                <Skeleton width="132px" height="132px" margin="0 0 8px" />
                <Skeleton width="132px" height="22px" margin="0 0 2px" />
                <Skeleton width="98px" height="18px" margin="0 0 3px" />
                <Skeleton width="44px" height="18px" />
              </ItemBox>
            ))}
          </ItemList>
        </ListBox>
      ))}
      <FlexCol padding="0 24px">
        <Skeleton width="100%" height="76px" margin="0 auto 48px" />
        <Skeleton width="189px" height="27px" margin="0 0 24px" />
        <ItemList className="eventList">
          {[0, 1, 2].map((id) => (
            <ItemBox key={id} className="eventItem">
              <FlexRowStart>
                <Skeleton width="132px" height="132px" margin="0 16px 0 0" />
                <FlexCol>
                  <Skeleton width="154px" height="24px" margin="0 0 2px 0" />
                  <Skeleton width="130px" height="24px" margin="0 0 2px 0" />
                  <Skeleton width="87px" height="22px" margin="0 0 20px 0" />
                  <Skeleton width="83px" height="38px" borderRadius="8px" />
                </FlexCol>
              </FlexRowStart>
            </ItemBox>
          ))}
        </ItemList>
        <Skeleton width="189px" height="27px" margin="0 0 24px 0" />
      </FlexCol>
      <Skeleton width="100%" height="39.4531vw" className="banner1" margin="0 0 24px" />
      <ItemList>
        {[0, 1, 2].map((id) => (
          <ItemBox key={id} className="openItem">
            <Skeleton width="100%" height="22px" margin="0 0 4px 0" />
            <Skeleton width="100%" height="22px" margin="0 0 4px 0" />
            <Skeleton width="32px" height="18px" margin="0 0 8px 0" />
            <Skeleton width="78px" height="18px" margin="0 0 16px 0" />
            <Skeleton width="86px" height="38px" borderRadius="8px" />
          </ItemBox>
        ))}
      </ItemList>
      <Skeleton width="calc(100% - 48px)" height="76px" margin="0 auto 48px" borderRadius="8px" />
      <Skeleton width="100%" height="86.7188vw" margin="0 auto 48px" className="banner2" />
      <Skeleton width="calc(100% - 48px)" height="76px" margin="0 auto 48px" borderRadius="8px" />
    </Container>
  );
};

const Container = styled.div`
  overflow: hidden;
  .eventList {
    padding-left: 0 !important;
  }
  .eventItem {
    display: flex;
  }
  .openItem {
    width: 220px;
    height: 194px;
    border: 1px solid #f2f2f2;
    padding: 24px;
    border-radius: 8px;
  }
  .banner1 {
    max-height: 202px;
  }
  .banner2 {
    max-height: 404px;
  }
`;

const ListBox = styled.div`
  padding-bottom: 48px;
`;

export default SpotSkeleton;
