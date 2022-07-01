import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { MenuImgBox, MenuLi, MenuTextBox } from '@pages/subscription/register';
import { getFormatPrice, SVGIcon } from '@utils/common';
import Image from 'next/image';
import styled from 'styled-components';

type TButtonType = 'select' | 'change' | 'delete';
interface IProps {
  item: any;
  menuSelectHandler: (id: number) => void;
  menuDeleteHandler?: (id: number) => void;
  buttonState?: boolean;
  buttonType?: TButtonType | string;
}
const MenuItem = ({ item, menuSelectHandler, menuDeleteHandler, buttonState = true, buttonType }: IProps) => {
  return (
    <MenuLi>
      {buttonType === 'delete' && (
        <button
          className="deleteBtn"
          onClick={() => {
            menuDeleteHandler && menuDeleteHandler(item.id);
          }}
        >
          <SVGIcon name="defaultCancel" />
        </button>
      )}
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
          <TextH5B>{getFormatPrice(String(item.menuPrice))}원</TextH5B>
          <div className="line"></div>
          <TextB2R>{item.count ? item.count : 1}개</TextB2R>
          {buttonType !== 'delete' && (
            <button
              disabled={buttonState ? false : true}
              className="changeBtn"
              onClick={() => {
                menuSelectHandler(item.id);
              }}
            >
              {buttonType === 'select' && '선택'}
              {buttonType === 'change' && '변경'}
            </button>
          )}
        </div>
      </MenuTextBox>
    </MenuLi>
  );
};

export default MenuItem;
