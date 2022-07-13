import { SubsMenuSheet } from '@components/BottomSheet/SubsSheet';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_SUBS_CALENDAR_SELECT_MENU, SET_SUBS_ORDER_MENUS, subscriptionForm } from '@store/subscription';
import { cloneDeep } from 'lodash-es';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import MenuItem from './MenuItem';
import { OptionUl } from './RequiredOptionListBox';

interface IProps {
  list: any;
}
const SelectOptionListBox = ({ list }: IProps) => {
  const dispatch = useDispatch();
  const { subsOrderMenus, subsCalendarSelectMenu } = useSelector(subscriptionForm);

  const menuSelectHandler = (id: number) => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <SubsMenuSheet type="select" buttonType="change" selectId={id} />,
      })
    );
  };

  const menuDeleteHandler = (id: number) => {
    const selectMenu = cloneDeep(subsCalendarSelectMenu);
    const orderMenus = cloneDeep(subsOrderMenus);

    selectMenu?.menuTableItems.map((item) => {
      if (item.id === id) {
        item.count = 0;
        item.selected = false;
      }
      return item;
    });

    orderMenus?.map((item) => {
      if (item.deliveryDate === selectMenu?.deliveryDate) {
        item.menuTableItems = selectMenu?.menuTableItems;
      }
      return item;
    });

    dispatch(SET_SUBS_CALENDAR_SELECT_MENU(selectMenu));
    dispatch(SET_SUBS_ORDER_MENUS(orderMenus));
  };

  return (
    <OptionUl>
      {list &&
        list.map(
          (item: any) =>
            item.main === false &&
            item.selected && (
              <MenuItem
                item={item}
                key={item.id}
                menuSelectHandler={() => {
                  menuSelectHandler(item.id);
                }}
                menuDeleteHandler={() => {
                  menuDeleteHandler(item.id);
                }}
                buttonType="delete"
              />
            )
        )}
    </OptionUl>
  );
};
const Container = styled.ul``;
export default SelectOptionListBox;
