import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { IMenus } from '@model/index';
import { MenuImgBox, MenuLi, MenuTextBox } from '@pages/subscription/register';
import { getMenuDisplayPrice } from '@utils/menu';
import Image from '@components/Shared/Image';

interface IProps {
  item: IMenus;
}
const SelectOptionItem = ({ item }: IProps) => {
  const { discount, price } = getMenuDisplayPrice(item.menuDetails ?? [{}]);
  return (
    <MenuLi key={item.id}>
      <MenuImgBox>
        <Image
          src={item.thumbnail[0].url}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
          className="rounded"
        />
      </MenuImgBox>
      <MenuTextBox>
        <TextB3R textHideMultiline>{item.name}</TextB3R>

        <div className="wrap">
          <TextH5B>{price - discount}원</TextH5B>
          <div className="line"></div>
          <TextB2R>1개</TextB2R>
          <button
            className="changeBtn"
            onClick={() => {
              // menuSelectHandler(item.id);
            }}
          >
            선택
          </button>
        </div>
      </MenuTextBox>
    </MenuLi>
  );
};

export default SelectOptionItem;
