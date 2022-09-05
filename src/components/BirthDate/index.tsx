import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { customSelect, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { getCustomDate } from '@utils/destination';

interface IProps {
  selected: { year: number; month: number; day: number };
  onChange: any;
}

const BirthDate = ({ selected, onChange }: IProps) => {
  const [days, setDays] = useState<number[]>([]);

  const { CURRENT_KOR_DATE } = getCustomDate();

  const years = () => {
    let year = CURRENT_KOR_DATE.getFullYear() - 13;
    return Array.from({ length: year - 1930 }, (v, i) => year - i);
  };

  const months = () => {
    return Array.from({ length: 12 }, (v, i) => i + 1);
  };

  useEffect(() => {
    const days = new Date(selected.year, selected.month, 0).getDate();
    setDays(Array.from({ length: days }, (v, i) => i + 1));
  }, [selected]);

  return (
    <Container>
      <YearWrapper isSelected={selected.year === 0}>
        <select name="year" value={selected.year} key={selected.year} onChange={onChange}>
          <Option className="placeholder" value={selected.year === 0 ? selected.year : 'YYYY'} disabled selected>
            YYYY
          </Option>
          {years().map((y, index) => (
            <Option value={y} key={index}>
              {y}
            </Option>
          ))}
          {/* <Option value={0}>선택 안 함</Option> */}
        </select>
        <SvgWrapper>
          <SVGIcon name="triangleDown" />
        </SvgWrapper>
      </YearWrapper>
      <MonthWrapper isSelected={selected.month === 0}>
        <select name="month" placeholder="MM" value={selected.month} key={selected.month} onChange={onChange}>
          <Option className="placeholder" value={selected.month === 0 ? selected.month : 'MM'} disabled selected>
            MM
          </Option>
          {months().map((m, index) => (
            <Option value={m} key={index}>
              {m}
            </Option>
          ))}
          {/* <Option value={0}>선택 안 함</Option> */}
        </select>
        <SvgWrapper>
          <SVGIcon name="triangleDown" />
        </SvgWrapper>
      </MonthWrapper>
      <DayWrapper isSelected={selected.day === 0}>
        <select name="day" placeholder="DD" value={selected.day} key={selected.day} onChange={onChange}>
          <Option className="placeholder" value={selected.day === 0 ? selected.day : 'DD'} disabled selected>
            DD
          </Option>
          {days?.map((d, index) => (
            <Option value={d} key={index}>
              {d}
            </Option>
          ))}
          {/* <Option value={0}>선택 안 함</Option> */}
        </select>
        <SvgWrapper>
          <SVGIcon name="triangleDown" />
        </SvgWrapper>
      </DayWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Option = styled.option``;

const YearWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  ${customSelect}
  margin-right: 10px;
  select {
    color: ${({ isSelected }) => (isSelected ? theme.greyScale45 : theme.black)};
  }
`;

const MonthWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  ${customSelect}
  margin-right: 10px;
  select {
    color: ${({ isSelected }) => (isSelected ? theme.greyScale45 : theme.black)};
  }
`;

const DayWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  ${customSelect};
  select {
    color: ${({ isSelected }) => (isSelected ? theme.greyScale45 : theme.black)};
  }
`;

const SvgWrapper = styled.div`
  position: absolute;
  right: 15%;
  top: 25%;
`;

export default React.memo(BirthDate);
