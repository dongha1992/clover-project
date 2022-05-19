import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { MenuImgBox, MenuLi, MenuTextBox } from '@pages/subscription/register';
import { getFormatPrice } from '@utils/common';
import Image from 'next/image';
import styled from 'styled-components';

interface IProps {
  item: any;
  menuSelectHandler: (id: number) => void;
}
const MenuItem = ({ item, menuSelectHandler }: IProps) => {
  return (
    <MenuLi>
      <MenuImgBox>
        <Image
          src={IMAGE_S3_URL + item.menuImage.url}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
          className="rounded"
        />
      </MenuImgBox>
      <MenuTextBox>
        <TextB3R textHideMultiline>
          {item.menuName} / {item.menuDetailName}
        </TextB3R>
        <div className="wrap">
          <TextH5B>{getFormatPrice(String(item.menuPrice - item.menuDiscount - item.eventDiscount))}원</TextH5B>
          <div className="line"></div>
          <TextB2R>{item.count ? item.count : 1}개</TextB2R>
          <button
            className="changeBtn"
            onClick={() => {
              menuSelectHandler(item.id);
            }}
          >
            선택
          </button>
        </div>
      </MenuTextBox>
    </MenuLi>
  );
};

export default MenuItem;