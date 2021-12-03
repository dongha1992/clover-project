import styled, { css } from 'styled-components';
import { breakpoints } from '@utils/getMediaQuery';
import { Obj } from '@model/index';

export const theme: Obj = {
  brandColor: '#35AD73',
  brandColor5: '#EDF3F0',
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
};

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const homePadding = css`
  padding: 0 24px;
`;

export const verticalCenter = css`
  display: flex;
  align-self: center;
`;

export const FlexCenter = styled.div<{ padding?: string; margin?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const FlexBetween = styled.div<{
  padding?: string;
  margin?: string;
  width?: string;
}>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  width: ${({ width }) => width && width};
`;

export const FlexBetweenStart = styled.div<{
  padding?: string;
  margin?: string;
}>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const FlexRowStart = styled.div<{ padding?: string; margin?: string }>`
  display: flex;
  align-items: start;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const FlexRow = styled.div<{ padding?: string; margin?: string }>`
  display: flex;
  align-items: center;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const FlexCol = styled.div<{ padding?: string; margin?: string }>`
  display: flex;
  flex-direction: column;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const FlexColEnd = styled.div<{ padding?: string; margin?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
`;

export const FlexColStart = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
`;

export const GridWrapper = styled.div<{ gap: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${({ gap }) => gap && gap}px;
`;

export const FlexStart = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const FlexEnd = styled.div<{ padding?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ padding }) => padding && padding};
`;

export const HomeContainer = styled.div`
  ${homePadding}
`;

export const showMoreText = css`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ItemListCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

export const ScrollHorizonList = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  width: auto;
  display: flex;
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
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
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
  letter-spacing: -0.4;
  font-weight: normal;
  line-height: 24px;
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
