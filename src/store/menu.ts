import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IMenus } from '@model/index';

type TProps = {
  menu: any;
  menuItem: IMenus | any;
  categoryMenus: IMenus[];
  info: any;
  menuKeyword: string;
  reviewImagesCount: number;
};

const initialState: TProps = {
  menu: [],
  menuItem: {},
  categoryMenus: [],
  info: {},
  menuKeyword: '',
  reviewImagesCount: 0,
};

export const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    SET_MENU: (state: any, action: PayloadAction<TProps>) => {
      state.menu = action.payload;
    },

    SET_MENU_ITEM: (state: any, action: PayloadAction<IMenus> | any) => {
      state.menuItem = action.payload;
    },
    INIT_MENU_ITEM: (state: any, action: PayloadAction) => {
      state.menuItem = {};
    },
    SET_CATEGORY_MENU: (state: any, action: PayloadAction<IMenus[]>) => {
      state.categoryMenus = action.payload;
    },
    UPDATE_CATEGORY_MENU: (state: any, action: PayloadAction<IMenus[]>) => {
      state.categoryMenus = action.payload;
    },
    INIT_CATEGORY_MENU: (state: any, action: PayloadAction) => {
      state.categoryMenus = [];
    },
    SET_INFO: (state: any, action: PayloadAction<IMenus>) => {
      state.info = action.payload;
    },
    SET_MENU_KEYWORD: (state: any, action: PayloadAction<string>) => {
      state.menuKeyword = action.payload;
    },
    INIT_MENU_KEYWORD: (state: any, action: PayloadAction) => {
      state.menuKeyword = '';
    },
    SET_REVIEW_IMAGES_COUNT: (state: any, action: PayloadAction<number>) => {
      state.reviewImagesCount = action.payload;
    },
  },
});

export const {
  SET_MENU,
  SET_MENU_ITEM,
  SET_CATEGORY_MENU,
  INIT_CATEGORY_MENU,
  INIT_MENU_ITEM,
  SET_INFO,
  SET_MENU_KEYWORD,
  INIT_MENU_KEYWORD,
  SET_REVIEW_IMAGES_COUNT,
} = menu.actions;
export const menuSelector = (state: AppState): TProps => state.menu;
export default menu.reducer;
