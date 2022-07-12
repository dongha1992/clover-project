import { TextB2R, TextH3B, TextH6B } from '@components/Shared/Text';
import { IMenus } from '@model/index';
import { ScrollHorizonList, theme } from '@styles/theme';
import SubsItem from './SubsItem';
import { ListBox, SubsList, SubsListContainer, TitleBox } from './SubsSpotList';
interface IProps {
  menus: IMenus[];
  moreClickHandler: () => void;
}
const SubsParcelList = ({ menus, moreClickHandler }: IProps) => {
  return (
    <SubsListContainer>
      <TitleBox>
        <div className="row">
          <TextH3B>새벽/택배 정기구독</TextH3B>
          <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={moreClickHandler}>
            더보기
          </TextH6B>
        </div>
        <TextB2R color={theme.greyScale65}>매주 신선한 샐러드를 집으로 배송시켜보세요</TextB2R>
      </TitleBox>
      <ListBox>
        <ScrollHorizonList>
          <SubsList>
            {menus?.map(
              (item, index) =>
                (item.subscriptionDeliveries?.includes('PARCEL') ||
                  item.subscriptionDeliveries?.includes('MORNING')) && (
                  <SubsItem item={item} key={index} height="168px" width="298px" testType="PARCEL" />
                )
            )}
            {menus?.filter(
              (item) =>
                item.subscriptionDeliveries?.includes('PARCEL') || item.subscriptionDeliveries?.includes('MORNING')
            ).length === 0 && <div>새벽/택배 구독 상품이 없습니다.</div>}
          </SubsList>
        </ScrollHorizonList>
      </ListBox>
    </SubsListContainer>
  );
};
export default SubsParcelList;
