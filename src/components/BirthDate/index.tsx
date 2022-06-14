import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { customSelect } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { getCustomDate, getFormatTime } from '@utils/destination';

interface IProps {
  selected: { year: number; month: number; day: number };
  onChange: any;
}

/* TODO: 렌더  */

const BirthDate = ({ selected, onChange }: IProps) => {
  const [days, setDays] = useState<number[]>([]);

  const { CURRENT_KOR_DATE } = getCustomDate(new Date());

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
      <YearWrapper>
        <select name="year" value={selected.year} key={selected.year} onChange={onChange}>
          <option className="placeholder" value={selected.year === 0 ? selected.year : 'YYYY'} disabled>
            YYYY
          </option>
          {years().map((y, index) => (
            <option value={y} key={index}>
              {y}
            </option>
          ))}
          <option value={0}>선택 안 함</option>
        </select>
        <SvgWrapper>
          <SVGIcon name="triangleDown" />
        </SvgWrapper>
      </YearWrapper>
      <MonthWrapper>
        <select name="month" placeholder="MM" value={selected.month} key={selected.month} onChange={onChange}>
          <option className="placeholder" value={selected.month === 0 ? selected.month : 'MM'} disabled>
            MM
          </option>
          {months().map((m, index) => (
            <option value={m} key={index}>
              {m}
            </option>
          ))}
          <option value={0}>선택 안 함</option>
        </select>
        <SvgWrapper>
          <SVGIcon name="triangleDown" />
        </SvgWrapper>
      </MonthWrapper>
      <DayWrapper>
        <select name="day" placeholder="DD" value={selected.day} key={selected.day} onChange={onChange}>
          <option className="placeholder" value={selected.day === 0 ? selected.month : 'DD'} disabled>
            DD
          </option>
          {days?.map((d, index) => (
            <option value={d} key={index}>
              {d}
            </option>
          ))}
          <option value={0}>선택 안 함</option>
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
const YearWrapper = styled.div`
  position: relative;
  ${customSelect}
  margin-right: 10px;
`;
const MonthWrapper = styled.div`
  position: relative;
  ${customSelect}
  margin-right: 10px;
`;
const DayWrapper = styled.div`
  position: relative;
  ${customSelect};
`;

const SvgWrapper = styled.div`
  position: absolute;
  right: 15%;
  top: 25%;
`;

export default React.memo(BirthDate);
