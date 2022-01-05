import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IJuso } from '@model/index';
import { stat } from 'fs';

interface TProps {
  userDestination: IJuso;
  tempLocation: IJuso;
  availableDestination: IAvailableDestination;
}

interface IAvailableDestination {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
}

const INITIAL_STATE: TProps = {
  userDestination: {
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
  availableDestination: {
    morning: false,
    quick: false,
    parcel: false,
  },
};

export const destination = createSlice({
  name: 'destination',
  initialState: INITIAL_STATE,
  reducers: {
    SET_DESTINATION: (state, action: PayloadAction<IJuso>) => {
      state.userDestination = action.payload;
    },
    SET_LOCATION_TEMP: (state, action: PayloadAction<IJuso>) => {
      state.tempLocation = action.payload;
    },
    SET_AVAILABLE_DESTINAION: (
      state,
      action: PayloadAction<IAvailableDestination>
    ) => {
      state.availableDestination = action.payload;
    },
  },
});

export const { SET_DESTINATION, SET_LOCATION_TEMP, SET_AVAILABLE_DESTINAION } =
  destination.actions;
export const destinationForm = (state: AppState): TProps => state.destination;
export default destination.reducer;
