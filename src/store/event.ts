import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {  
  eventTitle: string;
};

const initialState: TProps = {
    eventTitle: '',
};

export const event = createSlice({
  name: 'event',
  initialState,
  reducers: {
    SET_EVENT_TITLE: (state: any, action: PayloadAction<string>) => {
      state.eventTitle = action.payload;
    },
    INIT_EVENT_TITLE: (state: any, action: PayloadAction) => {
      state.eventTitle = '';
    },
  },
});

export const {
  SET_EVENT_TITLE,
  INIT_EVENT_TITLE,
} = event.actions;
export const eventSelector = (state: AppState): TProps => state.event;
export default event.reducer;
