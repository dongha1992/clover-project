import { SubsMenuSheet } from '@components/BottomSheet/SubsSheet';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import MenuItem from './MenuItem';
import { OptionLi, OptionUl } from './RequiredOptionListBox';

interface IProps {
  list: any;
}
const SelectOptionListBox = ({ list }: IProps) => {
  const dispatch = useDispatch();

  const menuSelectHandler = (id: number) => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <SubsMenuSheet type="select" buttonType="change" selectId={id} />,
      })
    );
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
                buttonType="change"
              />
            )
        )}
    </OptionUl>
  );
};
const Container = styled.ul``;
export default SelectOptionListBox;
