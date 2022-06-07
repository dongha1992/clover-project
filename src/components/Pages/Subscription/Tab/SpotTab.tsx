import styled from 'styled-components';
import { SubsItem } from '@components/Pages/Subscription';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';

const SpotTab = () => {
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
    <SpotBox>
      {menus?.map(
        (item, index) =>
          item.subscriptionDeliveries?.includes('SPOT') && <SubsItem item={item} key={index} height="50.7937vw" />
      )}
    </SpotBox>
  );
};
const SpotBox = styled.div``;
export default SpotTab;
