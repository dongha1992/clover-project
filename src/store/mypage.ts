import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IDestinationsResponse, ILocation } from '@model/index';

interface IEditSpot {
  spotPickupId: number;
  name: string;
  spotPickup: string;
  location: ILocation;
}

interface IState {
  tempOrderInfo: {
    isSamePerson: boolean;
    receiverName: string;
    receiverTel: string;
  };
  tempEditDestination: IDestinationsResponse | null;
  tempEditSpot: IEditSpot | null;
}

const INITIAL_STATE: IState = {
  tempOrderInfo: {
    isSamePerson: true,
    receiverName: '',
    receiverTel: '',
  },
  tempEditDestination: null,
  tempEditSpot: null,
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
    // 유저가 서버에 등록하지 않은 검색한 배송지 변경 시 배송지 정보
    SET_TEMP_EDIT_DESTINATION: (state, action: PayloadAction<IDestinationsResponse | null>) => {
      state.tempEditDestination = action.payload;
    },

    INIT_TEMP_EDIT_DESTINATION: (state, action: PayloadAction) => {
      state.tempEditDestination = null;
    },

    SET_TEMP_EDIT_SPOT: (state, action: PayloadAction<IEditSpot | null>) => {
      state.tempEditSpot = action.payload;
    },
  },
});

export const {
  SET_TEMP_ORDER_INFO,
  INIT_TEMP_ORDER_INFO,
  SET_TEMP_EDIT_DESTINATION,
  INIT_TEMP_EDIT_DESTINATION,
  SET_TEMP_EDIT_SPOT,
} = mypageSlice.actions;
export const mypageSelector = (state: AppState): IState => state.mypage;
export default mypageSlice.reducer;
