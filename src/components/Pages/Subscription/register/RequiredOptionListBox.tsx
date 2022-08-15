import { SubsMenuSheet } from '@components/BottomSheet/SubsSheet';
import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { MenuImgBox, MenuTextBox } from '@pages/subscription/register';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { theme } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import Image from '@components/Shared/Image';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

interface IProps {
  list: any;
}

// TODO : 수량은 한개일수밖에 없는지 물어보기

const RequiredOptionListBox = ({ list }: IProps) => {
  const dispatch = useDispatch();
  const mainMenuChangeHandler = (id: number) => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <SubsMenuSheet type="required" buttonType="change" selectId={id} />,
      })
    );
  };
  return (
    <OptionUl>
      {list &&
        list.map(
          (item: any, index: number) =>
            item.main &&
            item.selected && (
              <OptionLi key={index}>
                <MenuImgBox>
                  <Image
                    src={item.menuImage.url}
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
                    {item.changed && <span className="change">변경</span>}
                  </TextB3R>
                  <div className="wrap">
                    <TextH5B>{getFormatPrice(String(item.menuPrice))}원</TextH5B>
                    <div className="line"></div>
                    <TextB2R>1개</TextB2R>
                    <button
                      className="changeBtn"
                      onClick={() => {
                        mainMenuChangeHandler(item.id);
                      }}
                    >
                      변경
                    </button>
                  </div>
                </MenuTextBox>
              </OptionLi>
            )
        )}
    </OptionUl>
  );
};

export const OptionUl = styled.ul``;
export const OptionLi = styled.li`
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.greyScale6};
  &:last-of-type {
    border-bottom: none;
  }
  button.changeBtn {
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: -19px;
    padding: 10px 16px;
    border: 1px solid #242424;
    border-radius: 8px;
    color: ${theme.black};
  }
`;

export default RequiredOptionListBox;
