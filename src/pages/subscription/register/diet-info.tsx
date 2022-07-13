import DietItem from '@components/Pages/Subscription/DietItem';
import { TextB2R } from '@components/Shared/Text';
import { periodMapper } from '@constants/subscription';
import { subscriptionForm } from '@store/subscription';
import { theme } from '@styles/theme';
import 'dayjs/locale/ko';
import { cloneDeep } from 'lodash-es';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const DietInfoPage = () => {
  const { subsOrderMenus, subsInfo } = useSelector(subscriptionForm);

  const entireDiet = cloneDeep(subsOrderMenus)?.map((item) => {
    item.menuTableItems = item.menuTableItems
      .sort((a: any, b: any) => b.main - a.main)
      .filter((f: any) => f.selected === true);
    return item;
  });

  return (
    <Container>
      <TextB2R color={theme.brandColor} padding="16px 0 0 0">
        {subsInfo?.period === 'UNLIMITED' ? '5주간' : `${periodMapper[subsInfo?.period!]}간`}, 주{' '}
        {subsInfo?.deliveryDay?.length}회씩 ({subsInfo?.deliveryDay?.join('·')}) 총 {subsOrderMenus?.length}회 배송되는
        식단입니다.
      </TextB2R>
      <EntireUl>
        {entireDiet?.map((item, index) => (
          <DietItem item={item} index={index} key={item.deliveryDate} />
        ))}
      </EntireUl>
    </Container>
  );
};
const Container = styled.div`
  padding: 0 24px;
`;
const EntireUl = styled.ul``;

export default DietInfoPage;
