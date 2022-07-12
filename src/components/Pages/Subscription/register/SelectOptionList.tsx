import { IMenuTableItems } from '@model/index';
import { MenuUl } from '@pages/subscription/register';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_SUBS_CALENDAR_SELECT_MENU, SET_SUBS_ORDER_MENUS, subscriptionForm } from '@store/subscription';
import { cloneDeep } from 'lodash-es';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from './MenuItem';
import { OptionContainer } from './RequiredOptionList';

interface IProps {
  buttonType: string;
  selectId?: number;
}
const SelectOptionList = ({ buttonType, selectId }: IProps) => {
  const dispatch = useDispatch();
  const { subsOrderMenus, subsCalendarSelectMenu } = useSelector(subscriptionForm);

  const menuSelectHandler = (id: number) => {
    const selectMenu = cloneDeep(subsCalendarSelectMenu);
    const orderMenus = cloneDeep(subsOrderMenus);

    selectMenu?.menuTableItems.map((item) => {
      if (buttonType === 'change' && item.id === selectId) {
        item.selected = false;
        item.count = 0;
      }
      if (item.id === id) {
        item.selected = true;
        item.count = 1;
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
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <OptionContainer>
      <MenuUl>
        {subsCalendarSelectMenu &&
          subsCalendarSelectMenu?.menuTableItems?.map(
            (item: IMenuTableItems) =>
              item.main === false && (
                <MenuItem
                  item={item}
                  key={item.id}
                  menuSelectHandler={menuSelectHandler}
                  buttonState={item.selected ? false : true}
                  buttonType={buttonType}
                />
              )
          )}
      </MenuUl>
    </OptionContainer>
  );
};

export default SelectOptionList;
