import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IDestination } from '@store/destination';

interface IState {
  tempOrderInfo: {
    isSamePerson: boolean;
    receiverName: string;
    receiverTel: string;
  };
  tempEditDestination: IDestination | null;
}

const INITIAL_STATE: IState = {
  tempOrderInfo: {
    isSamePerson: true,
    receiverName: '',
    receiverTel: '',
  },
  tempEditDestination: null,
};

export const mypageSlice = createSlice({
  name: 'mypage',
  initialState: INITIAL_STATE,
  reducers: {
    SET_TEMP_ORDER_INFO: (state, { payload }: PayloadAction<IState['tempOrderInfo']>) => {
      state.tempOrderInfo = payload;
    },
    INIT_TEMP_ORDER_INFO: (state, { payload }: PayloadAction) => {
      state.tempOrderInfo = {
        isSamePerson: true,
        receiverName: '',
        receiverTel: '',
      };
    },
    // 서버에 등록하지 않은 유저가 검색한 배송지 변경 시 배송지 정보
    SET_TEMP_EDIT_DESTINATION: (state, action: PayloadAction<IDestination | null>) => {
      state.tempEditDestination = action.payload;
    },

    INIT_TEMP_EDIT_DESTINATION: (state, action: PayloadAction) => {
      state.tempEditDestination = null;
    },
  },
});

export const { SET_TEMP_ORDER_INFO, INIT_TEMP_ORDER_INFO, SET_TEMP_EDIT_DESTINATION, INIT_TEMP_EDIT_DESTINATION } =
  mypageSlice.actions;
export const mypageSelector = (state: AppState): IState => state.mypage;
export default mypageSlice.reducer;
