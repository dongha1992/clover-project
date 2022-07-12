import styled from 'styled-components';
import { SubsItem } from '@components/Pages/Subscription';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';

const ParcelTab = () => {
  const {
    data: menus,
    error: menuError,
    isLoading,
  } = useQuery(
    'getMenus',
    async () => {
      const params = { categories: '', menuSort: 'LAUNCHED_DESC', searchKeyword: '', type: 'SUBSCRIPTION' };
      const { data } = await getMenusApi(params);
      return data.data;
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );
  return (
    <DawnBox>
      {menus?.map(
        (item, index) =>
          (item.subscriptionDeliveries?.includes('PARCEL') || item.subscriptionDeliveries?.includes('MORNING')) && (
            <SubsItem item={item} key={index} height="50.7937vw" />
          )
      )}
      {menus?.filter(
        (item) => item.subscriptionDeliveries?.includes('PARCEL') || item.subscriptionDeliveries?.includes('MORNING')
      ).length === 0 && <div>새벽/택배 구독 상품이 없습니다.</div>}
    </DawnBox>
  );
};
const DawnBox = styled.div``;
export default ParcelTab;
