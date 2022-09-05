import { TextB2R, TextH3B, TextH6B } from '@components/Shared/Text';
import { IMenus } from '@model/index';
import { ScrollHorizonList, theme } from '@styles/theme';
import SubsItem from './SubsItem';
import { ListBox, SubsList, SubsListContainer, TitleBox } from './SubsSpotList';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper';
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
          <SubsList slidesPerView={'auto'} spaceBetween={16}>
            {menus?.map((item, index) => (
              <SwiperSlide key={index}>
                <SubsItem item={item} key={index} height="168px" width="298px" />
              </SwiperSlide>
            ))}
            {menus?.length === 0 && <div>새벽/택배 구독 상품이 없습니다.</div>}
          </SubsList>
        </ScrollHorizonList>
      </ListBox>
    </SubsListContainer>
  );
};
export default SubsParcelList;
