import type { StateWithHistory } from 'redux-undo';
import type { PersistPartial } from 'redux-persist/es/persistReducer';
import type { LayoutState } from './layoutSlice';

export type RootState = {
  layout: StateWithHistory<LayoutState> & PersistPartial;
};
