import styled, { css } from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { Obj } from '@model/index';
import { createGlobalStyle } from 'styled-components';

/* TODO: 주석 */

export const theme: Obj = {
  brandColor: '#35AD73',
  brandColor3p: '#F5FBF8',
  brandColor5: '#EDF3F0',
  brandColor5P: '#EBF7F1',
  fontFamily: "'Noto Sans KR', sans-serif;",
  white: '#FFFFFF',
  greyScale3: '#F8F8F8',
  greyScale6: '#F2F2F2',
  greyScale15: '#DEDEDE',
  greyScale25: '#C8C8C8',
  greyScale45: '#9C9C9C',
  greyScale65: '#717171',
  greyScale75: '#5B5B5B',
  greyScale85: '#454545',
  black: '#242424',
  systemRed: '#D32F2F',
  systemYellow: '#F4D740',
  morningColor: '#7922BC',
  parcelColor: '#1E7FF0',
  quickColor: '#9C9C9C',
};

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const homePadding = css`
  padding: 0 24px;
`;

export const categoryPageSet = css`
  width: 100%;
  padding: 48px 24px 24px 24px;
`;

export const verticalCenter = css`
  display: flex;
  align-self: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const FlexCenter = styled.div<{ padding?: string; margin?: string; pointer?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  cursor: ${(props) => (props.pointer ? 'pointer' : 'static')};
`;

export const FlexBetween = styled.div<{
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  pointer?: boolean;
}>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  width: ${({ width }) => width && width};
  height: ${({ height }) => height && height};
  cursor: ${(props) => (props.pointer ? 'pointer' : 'static')};
`;

export const FlexBetweenStart = styled.div<{
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
}>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  width: ${({ width }) => width && width};
  height: ${({ height }) => height && height};
`;

export const FlexRowStart = styled.div<{ padding?: string; margin?: string; width?: string }>`
  display: flex;
  align-items: start;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  width: ${({ width }) => width && width};
`;

export const FlexRow = styled.div<{
  padding?: string;
  margin?: string;
  id?: string;
  width?: string;
  pointer?: boolean;
}>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width && width};
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  cursor: ${({ pointer }) => (pointer ? 'pointer' : 'static')};
`;

export const FlexCol = styled.div<{
  padding?: string;
  margin?: string;
  width?: string;
  pointer?: boolean;
}>`
  display: flex;
  flex-direction: column;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  width: ${({ width }) => width && width};
  cursor: ${({ pointer }) => (pointer ? 'pointer' : 'static')};
`;

export const FlexColEnd = styled.div<{ padding?: string; margin?: string; width?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  width: ${({ width }) => width && width};
`;

export const FlexColStart = styled.div<{ margin?: string; padding?: string; width?: string }>`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const FlexColCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const GridWrapper = styled.div<{ gap: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${({ gap }) => gap && gap}px;
`;

export const FlexWrapWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

export const FlexStart = styled.div<{ padding?: string; margin?: string; alignItems?: string }>`
  width: 100%;
  display: flex;
  align-items: ${(props) => (props.alignItems ? props.alignItems : 'center')};
  justify-content: flex-start;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const FlexEnd = styled.div<{ padding?: string; margin?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const HomeContainer = styled.div`
  ${homePadding}
`;

export const showMoreText = css`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const ItemListCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

export const ScrollHorizonList = styled.div<{ height?: string }>`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  width: auto;
  display: flex;
  height: ${({ height }) => height && height};
`;

export const fixedBottom = css`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: ${({ theme }) => theme.black};

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0%;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

export const FixedTab = styled.div`
  position: fixed;
  width: 100%;
  left: calc(50%);
  right: 0;
  background-color: white;
  max-width: ${breakpoints.mobile}px;
  width: 100%;
  z-index: 99;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

export const fixedTab = css`
  position: fixed;
  width: 100%;
  left: calc(50%);
  right: 0;
  background-color: white;
  max-width: ${breakpoints.mobile}px;
  width: 100%;
  z-index: 99;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

export const bottomSheetButton = css`
  z-index: 100;
  position: absolute;
  display: flex;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 56px;
`;

export const textH1 = css`
  font-size: 24px;
  letter-spacing: -0.4;
  font-weight: bold;
  line-height: 38px;
`;

export const textH2 = css`
  font-size: 20px;
  letter-spacing: -0.4;
  font-weight: bold;
  line-height: 30px;
`;
export const textH3 = css`
  font-size: 18px;
  letter-spacing: -0.4;
  font-weight: bold;
  line-height: 26px;
`;
export const textH4 = css`
  font-size: 16px;
  letter-spacing: -0.4;
  font-weight: bold;
  line-height: 24px;
`;
export const textH5 = css`
  font-size: 14px;
  letter-spacing: -0.4;
  font-weight: bold;
  line-height: 24px;
`;
export const textH6 = css`
  font-size: 12px;
  letter-spacing: -0.4;
  font-weight: bold;
  line-height: 18px;
`;
export const textH7 = css`
  font-size: 10px;
  letter-spacing: -0.4;
  font-weight: bold;
  line-height: 16px;
`;
export const textBody1 = css`
  font-size: 16px;
  letter-spacing: -0.4;
  font-weight: normal;
  line-height: 24px;
`;
export const textBody2 = css`
  font-size: 14px;
  letter-spacing: -0.4px;
  font-weight: normal;
  line-height: 22px;
`;
export const textBody3 = css`
  font-size: 12px;
  letter-spacing: -0.4;
  font-weight: normal;
  line-height: 18px;
`;
export const textBody4 = css`
  font-size: 10px;
  letter-spacing: -0.4;
  font-weight: normal;
  line-height: 16px;
`;

export const customInput = css`
  width: 100%;
  border: none;
  padding: 12px 16px 12px 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  border-radius: 8px;
  color: black;
  background-color: white;
`;

export const customInputWrapper = css`
  width: 100%;
  border: 1px solid ${theme.greyScale15};
  width: 100%;
  height: 48px;
  border-radius: 8px;
`;

export const customSelect = css`
  width: 100%;
  ${customInputWrapper}
  select {
    height: 100%;
    ${customInput}
    ${textBody2}
  }
`;

export const LiCircle3 = styled.li<{ top: number; left: number; color: string }>`
  position: relative;
  display: flex;
  flex-direction: row;
  padding-left: 19px;
  &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 3px;
    top: ${({ top }) => `${top}px`};
    left: ${({ left }) => `${left}px`};
    background-color: ${({ color }) => color};
  }
`;
