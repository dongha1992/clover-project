import { TextB1R, TextB2R, TextH6B } from '@components/Shared/Text';
import { getFormatDate, SVGIcon } from '@utils/common';
import { useState } from 'react';
import styled from 'styled-components';
import 'dayjs/locale/ko';
import { FlexBetween, FlexRow } from '@styles/theme';
import SlideToggle from '@components/Shared/SlideToggle';

interface IProps {
  item: any;
  index: number;
}
const DietItem = ({ item, index }: IProps) => {
  const [toggleState, setToggleState] = useState(false);

  return (
    <ToggleItemContainer>
      <FlexBetween
        className="title"
        onClick={() => {
          setToggleState((prev) => !prev);
        }}
      >
        <TextB1R>
          <b>
            배송 {index + 1}
            회차
          </b>{' '}
          - {getFormatDate(item.deliveryDate)}
        </TextB1R>
        <div className={`svgBox ${toggleState ? 'down' : ''}`}>
          <SVGIcon name="triangleDown" />
        </div>
      </FlexBetween>
      {item.changed && (
        <FlexRow>
          <SVGIcon name="exclamationMark" />
          <TextB2R margin="2px 0 0 4px" color="#35AD73">
            변경된 메뉴를 확인해주세요!
          </TextB2R>
        </FlexRow>
      )}
      <SlideToggle state={toggleState} duration={0.3}>
        <ul className="menuList">
          {item.menuTableItems.map((menu: any) => (
            <li key={menu.id}>
              <FlexBetween>
                <FlexRow>
                  <TextB2R>
                    {menu.menuName} / {menu.menuDetailName}
                  </TextB2R>
                  {menu.changed && (
                    <TextH6B margin="0 0 0 4px" color="#35AD73">
                      변경
                    </TextH6B>
                  )}
                </FlexRow>
                <TextB2R>{menu.count ? menu.count : 1}개</TextB2R>
              </FlexBetween>
            </li>
          ))}
        </ul>
      </SlideToggle>
    </ToggleItemContainer>
  );
};
const ToggleItemContainer = styled.li`
  padding: 24px 0;
  border-bottom: 1px solid #f2f2f2;
  &:last-of-type {
    border-bottom: none;
  }
  b {
    font-weight: bold;
  }
  .svgBox {
    display: flex;
    align-items: center;
  }
  .title {
    cursor: pointer;
  }
  .menuList {
    padding-top: 24px;
    li {
      padding-bottom: 8px;
      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }
`;
export default DietItem;
