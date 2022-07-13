import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IGetCart, IDiscountInfos, IMenuDetailOptions } from '@model/index';

export interface ICartLists {
  cartMenus: IGetCart[];
  discountInfos: IDiscountInfos[];
  menuDetailOptions: IMenuDetailOptions[];
}
interface IProps {
  cartLists: ICartLists[];
  nonMemberCartLists: IGetCart[];
  cartSheetObj: any;
  isFromDeliveryPage: boolean;
  isLoading: boolean;
  isError: boolean;
}

const initialState: IProps = {
  cartLists: [],
  nonMemberCartLists: [],
  cartSheetObj: {},
  isFromDeliveryPage: false,
  isLoading: false,
  isError: false,
};

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // bottom sheet 눌렀을 때
    SET_CART_SHEET_OBJ: (state, action: PayloadAction<IProps>) => {
      state.cartSheetObj = action.payload;
    },

    // 장바구니 api 호출 후
    SET_CART_LISTS: (state, action: PayloadAction<ICartLists>) => {
      state.cartLists.push(action.payload);
    },

    INIT_CART_LISTS: (state, action: PayloadAction) => {
      state.cartLists = [];
    },

    SET_AFTER_SETTING_DELIVERY: (state, action: PayloadAction) => {
      state.isFromDeliveryPage = true;
    },

    INIT_AFTER_SETTING_DELIVERY: (state, action: PayloadAction) => {
      state.isFromDeliveryPage = false;
    },

    REMOVE_CART_ITEM: (state, { payload }: PayloadAction<number>) => {
      // const newState = state.tempSelectedMenus.filter(
      //   (item) => item.id !== payload
      // );
    },
    SET_NON_MEMBER_CART_LISTS: (state, action: PayloadAction<IGetCart>) => {
      console.log(action.payload, 'action.payload');
      state.nonMemberCartLists.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    // builder.addCase(UPDATE_CART_LIST.pending, (state) => {
    //   state.isLoading = true;
    // });
    // builder.addCase(UPDATE_CART_LIST.fulfilled, (state: any, action) => {
    //   state.isLoading = false;
    //   state.cartLists = action.payload;
    // });
    // builder.addCase(UPDATE_CART_LIST.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    // });
  },
});

export const {
  SET_CART_LISTS,
  SET_CART_SHEET_OBJ,
  SET_AFTER_SETTING_DELIVERY,
  INIT_AFTER_SETTING_DELIVERY,
  REMOVE_CART_ITEM,
  INIT_CART_LISTS,
  SET_NON_MEMBER_CART_LISTS,
} = cart.actions;
export const cartForm = (state: AppState): IProps => state.cart;
export default cart.reducer;
