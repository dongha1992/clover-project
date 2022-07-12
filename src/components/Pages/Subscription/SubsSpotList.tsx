import { TextB2R, TextH3B, TextH6B } from '@components/Shared/Text';
import { IMenus } from '@model/index';
import { ScrollHorizonList, theme } from '@styles/theme';
import styled from 'styled-components';
import SubsItem from './SubsItem';
interface IProps {
  menus: IMenus[];
  moreClickHandler: () => void;
}
const SubsSpotList = ({ menus, moreClickHandler }: IProps) => {
  return (
    <SubsListContainer>
      <TitleBox>
        <div className="row">
          <TextH3B>프코스팟 정기구독</TextH3B>
          <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={moreClickHandler}>
            더보기
          </TextH6B>
        </div>
        <TextB2R color={theme.greyScale65}>매주 무료배송으로 스팟에서 픽업해보세요</TextB2R>
      </TitleBox>
      <ListBox>
        <ScrollHorizonList>
          <SubsList>
            {menus?.map(
              (item, index) =>
                item.subscriptionDeliveries?.includes('SPOT') && (
                  <SubsItem item={item} key={index} height="168px" width="298px" testType="SPOT" />
                )
            )}
          </SubsList>
        </ScrollHorizonList>
      </ListBox>
    </SubsListContainer>
  );
};
export const SubsListContainer = styled.article`
  padding-bottom: 44px;
`;
export const TitleBox = styled.div`
  padding: 0 24px 24px;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
  }
`;
export const ListBox = styled.div`
  padding-left: 24px;
`;

export const SubsList = styled.div`
  display: flex;
  > div {
    margin-right: 16px;
    margin-bottom: 0;
  }
`;
export default SubsSpotList;
