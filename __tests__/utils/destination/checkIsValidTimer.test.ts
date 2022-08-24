import checkIsValidTimer from '@utils/destination/checkIsValidTimer';

describe('checkIsValidTimer', () => {
  it('return false when 주말(토,일)', () => {
    expect(checkIsValidTimer('2022-08-27', '새벽배송타이머')).toBeFalsy();
  })

  it('return false when 스팟저녁', () => {
    expect(checkIsValidTimer('2022-08-25', '스팟저녁')).toBeFalsy();
  })

  it('return false when 새벽택배', () => {
    expect(checkIsValidTimer('2022-08-25', '새벽택배')).toBeFalsy();
  })

  it('return true when 새벽배송타이머', () => {
    expect(checkIsValidTimer('2022-08-25', '새벽배송타이머')).toBeTruthy();
  })

  it('return true when 택배배송타이머', () => {
    expect(checkIsValidTimer('2022-08-25', '택배배송타이머')).toBeTruthy();
  })
})