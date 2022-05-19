import EntireItem from '@components/Pages/Subscription/EntireItem';
import ToggleItem from '@components/Pages/Subscription/EntireItem';
import { TextB1R, TextB2R } from '@components/Shared/Text';
import { Obj } from '@model/index';
import { subscriptionForm } from '@store/subscription';
import { theme } from '@styles/theme';
import { getFormatDate, SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const EntireDietPage = () => {
  const { subsOrderMenus, subsDeliveryExpectedDate, subsInfo } = useSelector(subscriptionForm);
  const mapper: Obj = {
    ONE_WEEK: '1주',
    TWO_WEEK: '2주',
    THREE_WEEK: '3주',
    FOUR_WEEK: '4주',
    UNLIMITED: '정기구독',
  };
  return (
    <Container>
      <TextB2R color={theme.brandColor} padding="16px 0 0 0">
        {subsInfo?.period === 'UNLIMITED' ? '5주간' : `${mapper[subsInfo?.period!]}간`}, 주{' '}
        {subsInfo?.deliveryDay?.length}회씩 ({subsInfo?.deliveryDay?.join('·')}) 총 {subsOrderMenus?.length}회 배송되는
        식단입니다.
      </TextB2R>
      <EntireUl>
        {subsOrderMenus?.map((item) => (
          <EntireItem item={item} key={item.deliveryDate} />
        ))}
      </EntireUl>
    </Container>
  );
};
const Container = styled.div`
  padding: 0 24px;
`;
const EntireUl = styled.ul``;

export default EntireDietPage;
