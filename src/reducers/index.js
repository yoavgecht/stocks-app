import { combineReducers } from 'redux';
import DataReducer from './data-reducer';

const reducers = {
  dataReducer: DataReducer
}

const rootReducer = combineReducers(reducers);

export default rootReducer;