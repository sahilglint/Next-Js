import debounce from 'lodash.debounce';
import type { AnyAction, Dispatch } from 'redux';
import type { MiddlewareAPI } from '@reduxjs/toolkit';
import type { Block } from './layoutSlice';
import type { RootState } from './types';

const debouncedSave = debounce((blocks: Block[]) => {
  console.log('✅ Auto-saving layout:', blocks);
}, 1000);

function autosaveMiddleware(store: MiddlewareAPI<Dispatch<AnyAction>, RootState>) {
  return (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    const result = next(action);

    if (action.type?.startsWith('layout/')) {
      const blocks = store.getState().layout?.present?.blocks;
      if (Array.isArray(blocks)) {
        debouncedSave(blocks);
      }
    }

    return result;
  };
}

export default autosaveMiddleware;
