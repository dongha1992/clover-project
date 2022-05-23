import { getMenusApi } from '@api/menu';
import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { IMenuTableItems } from '@model/index';
import Id from '@pages/subscription/products/[id]';
import { MenuImgBox, MenuLi, MenuTextBox, MenuUl } from '@pages/subscription/register';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_SUBS_CALENDAR_SELECT_MENU, SET_SUBS_ORDER_MENUS, subscriptionForm } from '@store/subscription';
import { getMenuDisplayPrice } from '@utils/menu';
import { cloneDeep } from 'lodash-es';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import MenuItem from './MenuItem';
import { OptionContainer } from './RequiredOptionList';
import SelectOptionItem from './SelectOptionItem';

const SelectOptionList = () => {
  const dispatch = useDispatch();
  const { subsOrderMenus, subsCalendarSelectMenu } = useSelector(subscriptionForm);

  const menuSelectHandler = (id: number) => {
    const selectMenu = cloneDeep(subsCalendarSelectMenu);
    const orderMenus = cloneDeep(subsOrderMenus);

    selectMenu?.menuTableItems.map((item) => {
      if (item.id === id) {
        item.selected = true;
        item.count ? (item.count = item.count + 1) : (item.count = 1);
      }
      return item;
    });
    console.log('dfdsfdsf', selectMenu);

    orderMenus?.map((item) => {
      if (item.deliveryDate === selectMenu?.deliveryDate) {
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
              item.main === false && <MenuItem item={item} key={item.id} menuSelectHandler={menuSelectHandler} />
          )}
      </MenuUl>
    </OptionContainer>
  );
};

export default SelectOptionList;
