import { AnyAction, combineReducers, configureStore, createAction } from '@reduxjs/toolkit';

import graphReducer from '../components/modules/editor/Graph/slice';
import graphV2Reducer from '../components/modules/vizeditor/slice';
import texteditorReducer from '../components/modules/editor/TextEditor/slice';
import styleeditorReducer from '../components/modules/editor/StyleEditor/slice';
import graphMetadataReducer from '../components/modules/editor/GraphMetadata/slice';
import syncReducer from '../components/modules/editor/Sync/slice';
import alertReducer from '../components/elements/alert/slice';
import _ from 'lodash';

export const loadGraphAction = createAction<any>('root/loadGraph');
export const newGraphCreatedAction = createAction<string>('root/newGraphCreated');

const combinedReducers = combineReducers({
  graph: graphReducer,
  graphv2: graphV2Reducer,
  texteditor: texteditorReducer,
  styleeditor: styleeditorReducer,
  graphmetadata: graphMetadataReducer,
  sync: syncReducer,
  alert: alertReducer,
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type == loadGraphAction.type) {
    let modifiedState = _.cloneDeep(action.payload);
    if (modifiedState.sync) {
      modifiedState.sync.shouldSync = false;
    }
    modifiedState.graph.canEdit = true;
    state = modifiedState;
  }
  return combinedReducers(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

// convert object to string and store in localStorage
function saveToLocalStorage(state: RootState) {
  try {
    if (state.graphmetadata.id && state.graphmetadata.shouldSave) {
      const stored = JSON.parse(localStorage.getItem('graphs') || '{}');
      const modifiedState = _.cloneDeep(state);
      modifiedState.sync.shouldSync = false;
      stored[state.graphmetadata.id] = modifiedState;
      localStorage.setItem('graphs', JSON.stringify(stored));
    }
  } catch (e) {
    console.warn(e);
  }
}

const debouncedSaveToLocalStorage = _.debounce(saveToLocalStorage, 1000);

store.subscribe(() => debouncedSaveToLocalStorage(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
