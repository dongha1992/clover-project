import styled from 'styled-components';
import MenuItem from './MenuItem';
import { OptionLi, OptionUl } from './RequiredOptionListBox';

interface IProps {
  list: any;
}
const SelectOptionListBox = ({ list }: IProps) => {
  const menuSelectHandler = () => {};

  return (
    <OptionUl>
      {list &&
        list.map(
          (item: any) =>
            item.main === false &&
            item.selected && <MenuItem item={item} key={item.id} menuSelectHandler={menuSelectHandler} />
        )}
    </OptionUl>
  );
};
const Container = styled.ul``;
export default SelectOptionListBox;
