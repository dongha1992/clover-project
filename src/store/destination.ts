import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IJuso, IRegisterDestination } from '@model/index';

interface IAvailableDestination {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
}

interface TProps {
  userDestination: IRegisterDestination;
  tempLocation: IJuso;
  userLocation: IJuso;
  availableDestination: IAvailableDestination;
  destinationStatus: string;
  userDestinationStatus: string;
  locationStatus: string;
}

const locationState = {
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
  detailJuso: null,
};

const destinationState = {
  addressDetail: '',
  name: '',
  address: '',
  delivery: '',
  deliveryMessage: '',
  dong: '',
  main: false,
  receiverName: '',
  receiverTel: '',
  zipCode: '',
  deliveryMessageType: '',
};

const INITIAL_STATE: TProps = {
  userDestination: {
    ...destinationState,
  },
  tempLocation: {
    ...locationState,
  },
  userLocation: {
    ...locationState,
  },
  availableDestination: {
    morning: false,
    quick: false,
    parcel: false,
  },
  locationStatus: '',
  destinationStatus: '',
  userDestinationStatus: '',
};

export const destination = createSlice({
  name: 'destination',
  initialState: INITIAL_STATE,
  reducers: {
    SET_DESTINATION: (state, action: PayloadAction<IRegisterDestination>) => {
      state.userDestination = action.payload;
    },
    SET_LOCATION: (state, action: PayloadAction<IJuso>) => {
      state.userLocation = action.payload;
    },
    SET_LOCATION_STATUS: (state, action: PayloadAction<string>) => {
      state.locationStatus = action.payload;
    },
    SET_LOCATION_TEMP: (state, action: PayloadAction<IJuso>) => {
      state.tempLocation = action.payload;
    },
    INIT_LOCATION_TEMP: (state, action: PayloadAction) => {
      state.tempLocation = locationState;
    },
    SET_AVAILABLE_DESTINATION: (
      state,
      action: PayloadAction<IAvailableDestination>
    ) => {
      state.availableDestination = action.payload;
    },
    SET_DESTINATION_STATUS: (state, action: PayloadAction<string>) => {
      state.destinationStatus = action.payload;
    },
    SET_USER_DESTINATION_STATUS: (state, action: PayloadAction<string>) => {
      state.userDestinationStatus = action.payload;
    },
  },
});

export const {
  SET_DESTINATION,
  SET_LOCATION,
  SET_LOCATION_TEMP,
  SET_LOCATION_STATUS,
  SET_AVAILABLE_DESTINATION,
  INIT_LOCATION_TEMP,
  SET_DESTINATION_STATUS,
  SET_USER_DESTINATION_STATUS,
} = destination.actions;
export const destinationForm = (state: AppState): TProps => state.destination;
export default destination.reducer;
