export const PHONE_REGX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

export const SPECIAL_REGX = /[~!@#$%^&*()_+|<>?:{}]/;

export const ADDRESS_KEYWORD_REGX = [
  'or',
  'select',
  'insert',
  'delete',
  'update',
  'create',
  'drop',
  'exec',
  'union',
  'fetch',
  'declare',
  'truncate',
];
