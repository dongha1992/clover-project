import cloneDeep from 'lodash-es/cloneDeep';
import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { IMenuTableItems } from '@model/index';
import { MenuImgBox, MenuLi, MenuTextBox, MenuUl } from '@pages/subscription/register';
import { SET_SUBS_CALENDAR_SELECT_MENU, SET_SUBS_ORDER_MENUS, subscriptionForm } from '@store/subscription';
import Image from 'next/image';
import { IMAGE_S3_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import MenuItem from './MenuItem';

const RequiredOptionList = () => {
  const dispatch = useDispatch();
  const { subsOrderMenus, subsCalendarSelectMenu, subsDeliveryExpectedDate } = useSelector(subscriptionForm);

  const menuSelectHandler = (id: number) => {
    const selectMenu = cloneDeep(subsCalendarSelectMenu);
    const orderMenus = cloneDeep(subsOrderMenus);
    const menuChangeDate = cloneDeep(subsDeliveryExpectedDate);
    console.log('필수메뉴 체인지', selectMenu, orderMenus);

    selectMenu?.menuTableItems.map((item) => {
      if (item.id === id) {
        item.selected = true;
        item.changed = true;
      } else {
        if (item.main) item.selected = false;
      }
      return item;
    });

    orderMenus?.map((item) => {
      if (item.deliveryDate === selectMenu?.deliveryDate) {
        item.changed = true;
        item.menuTableItems = selectMenu?.menuTableItems;
      }
      return item;
    });

    dispatch(SET_SUBS_CALENDAR_SELECT_MENU(selectMenu));
    dispatch(SET_SUBS_ORDER_MENUS(orderMenus));
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <OptionContainer>
      <MenuUl>
        {subsCalendarSelectMenu &&
          subsCalendarSelectMenu?.menuTableItems?.map(
            (item: IMenuTableItems) =>
              item.main && (
                <MenuItem
                  item={item}
                  key={item.id}
                  menuSelectHandler={menuSelectHandler}
                  buttonType="change"
                  buttonState={item.selected ? false : true}
                />
              )
          )}
      </MenuUl>
    </OptionContainer>
  );
};
export const OptionContainer = styled.div`
  padding: 0 24px;
  height: calc(100vh - 104px);
  overflow-y: scroll;
  position: fixed;
  width: 100%;
`;
export default RequiredOptionList;
