import { TextB2R, TextH5B } from '@components/Shared/Text';
import { subscriptionForm } from '@store/subscription';
import { FlexBetween } from '@styles/theme';
import { getFormatDate } from '@utils/common';
import { cloneDeep } from 'lodash-es';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const SubsOrderList = () => {
  const { subsOrderMenus } = useSelector(subscriptionForm);
  const menus = cloneDeep(subsOrderMenus);
  return (
    <SubsOrderListContainer>
      <ul>
        {menus?.map((item: any, index: number) => (
          <li key={index}>
            <TextH5B padding="0 0 16px">
              배송 {index + 1}회차 - {getFormatDate(item.deliveryDate)}
            </TextH5B>
            {item.menuTableItems
              ?.sort((a: any, b: any) => b.main - a.main)
              .map(
                (menu: any, index: number) =>
                  menu.selected && (
                    <FlexBetween padding="0 0 8px" key={index}>
                      <TextB2R>
                        {menu.menuName} / {menu.menuDetailName}
                      </TextB2R>
                      <TextB2R>1개</TextB2R>
                    </FlexBetween>
                  )
              )}
          </li>
        ))}
      </ul>
    </SubsOrderListContainer>
  );
};
const SubsOrderListContainer = styled.div`
  padding-top: 16px;
  ul {
    li {
      border-top: 1px solid #f2f2f2;
      padding: 16px 0;
      > div:last-of-type {
        padding-bottom: 0;
      }
      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }
`;
export default SubsOrderList;
