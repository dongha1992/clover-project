import { afterDateN, dateN, getDateFormat } from '@utils/common';
import { afterDate, getWeekDay } from '@utils/common/dateHelper';

describe('dateHelper', () => {
  describe('getFormatDate', () => {
    it('return M월 DD일 (요일)', () => {
      const date = getDateFormat('2022-08-24');
      expect(date).toEqual('8월 24일 (수)');
    })
  })

  describe('dateN', () => {
    it('return YYYYMMDD', () => {
      const date = dateN('2022-08-24');
      expect(date).toEqual(20220824);
    })
  })

  describe('afterDateN', () => {
    it('return X일후 YYYYMMDD 날짜', () => {
      const date = afterDateN('2022-08-24', 1);
      expect(date).toEqual(20220825);
    })
  })

  describe('afterDate', () => {
    it('return X일후 YYYYMMDD 날짜', () => {
      const date = afterDate('2022-08-24', 1);
      expect(date).toEqual('2022-08-25');
    })
  })

  describe('getWeekDay', () => {
    it('return 요일', () => {
      const date = getWeekDay('2022-08-24');
      expect(date).toEqual('수');
    })
  })

  describe('getCurrentDate', () => {
    it('return YYYY-MM-DD', () => {
      const date = getDateFormat('2022-08-24');
      expect(date).toEqual('8월 24일 (수)');
    })
  })

})
