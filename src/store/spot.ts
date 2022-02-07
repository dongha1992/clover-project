import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { ISpotsDetail } from '@model/index';

interface IProps {
  spotDetail: ISpotsDetail | any;
  isSpotLiked: Boolean;
};

const initialState: IProps = {
  spotDetail: {},
  isSpotLiked: false,
};


export const spot = createSlice({
  name: 'spot',
  initialState,
  reducers: {
    SPOT_ITEM: (state, action: PayloadAction<ISpotsDetail>) => {
      state.spotDetail = action.payload;
    },
    SET_SPOT_LIKED: (state, action : PayloadAction<any>) => {
      state.isSpotLiked = action.payload;
    },
  },
});

export const { SPOT_ITEM, SET_SPOT_LIKED } = spot.actions;
export const spotSelector = (state: AppState): IProps => state.spot;
export default spot.reducer;
