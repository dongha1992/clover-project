import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IJuso } from '@model/index';

type TProps = {
  tempDestination: IJuso;
  tempLocation: IJuso;
};

const INITIAL_STATE: TProps = {
  tempDestination: {
    roadAddr: null,
    roadAddrPart1: null,
    roadAddrPart2: null,
    jibunAddr: null,
    engAddr: null,
    zipNo: null,
    admCd: null,
    rnMgtSn: null,
    bdMgtSn: null,
    detBdNmList: null,
    bdNm: null,
    bdKdcd: null,
    siNm: null,
    sggNm: null,
    emdNm: null,
    liNm: null,
    rn: null,
    udrtYn: null,
    buldMnnm: null,
    buldSlno: null,
    mtYn: null,
    lnbrMnnm: null,
    lnbrSlno: null,
    emdNo: null,
  },
  tempLocation: {
    roadAddr: null,
    roadAddrPart1: null,
    roadAddrPart2: null,
    jibunAddr: null,
    engAddr: null,
    zipNo: null,
    admCd: null,
    rnMgtSn: null,
    bdMgtSn: null,
    detBdNmList: null,
    bdNm: null,
    bdKdcd: null,
    siNm: null,
    sggNm: null,
    emdNm: null,
    liNm: null,
    rn: null,
    udrtYn: null,
    buldMnnm: null,
    buldSlno: null,
    mtYn: null,
    lnbrMnnm: null,
    lnbrSlno: null,
    emdNo: null,
  },
};

export const destination = createSlice({
  name: 'destination',
  initialState: INITIAL_STATE,
  reducers: {
    SET_DESTINATION_TEMP: (state, action: PayloadAction<IJuso>) => {
      state.tempDestination = action.payload;
    },
    SET_LOCATION_TEMP: (state, action: PayloadAction<IJuso>) => {
      state.tempLocation = action.payload;
    },
  },
});

export const { SET_DESTINATION_TEMP, SET_LOCATION_TEMP } = destination.actions;
export const destinationForm = (state: AppState): TProps => state.destination;
export default destination.reducer;
