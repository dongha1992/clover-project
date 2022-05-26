import styled from 'styled-components';
import { SubsItem } from '@components/Pages/Subscription';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';

const DawnTab = () => {
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
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );
  return (
    <DawnBox>
      {menus?.map(
        (item, index) =>
          ['PARCEL', 'MORNING'].includes(item.subscriptionDelivery as string) && <SubsItem item={item} key={index} />
      )}
      {menus?.filter((item) => ['PARCEL', 'MORNING'].includes(item.subscriptionDelivery as string)).length === 0 && (
        <div>새벽/택배 구독 상품이 없습니다.</div>
      )}
    </DawnBox>
  );
};
const DawnBox = styled.div``;
export default DawnTab;
