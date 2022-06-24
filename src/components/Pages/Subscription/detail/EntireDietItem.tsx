import SlideToggle from '@components/Shared/SlideToggle';
import { TextB1R, TextB2R, TextH6B } from '@components/Shared/Text';
import { FlexBetween, FlexRow } from '@styles/theme';
import { getFormatDate, SVGIcon } from '@utils/common';
import { useState } from 'react';
import styled from 'styled-components';

interface IProps {
  item: any;
  index: number;
}
const EntireDietItem = ({ item, index }: IProps) => {
  const [toggleState, setToggleState] = useState(false);

  return (
    <DietItemContainer key={index}>
      <FlexBetween
        className="title"
        onClick={() => {
          setToggleState((prev) => !prev);
        }}
      >
        <TextB1R>
          <b>
            배송 {item?.deliveryRound ?? index + 1}
            회차
          </b>{' '}
          - {getFormatDate(item.deliveryDate)}
        </TextB1R>
        <div className={`svgBox ${toggleState ? 'down' : ''}`}>
          <SVGIcon name="triangleDown" />
        </div>
      </FlexBetween>
      {item.deliveryDateChangeCount !== 0 && (
        <FlexRow>
          <SVGIcon name="exclamationMark" />
          <TextB2R margin="2px 0 0 4px" color="#35AD73">
            배송일을 변경했어요.
          </TextB2R>
        </FlexRow>
      )}
      <SlideToggle state={toggleState} duration={0.3}>
        <ul className="menuList">
          {item?.orderMenus.map((menu: any) => (
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
    </DietItemContainer>
  );
};
const DietItemContainer = styled.li`
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
export default EntireDietItem;
