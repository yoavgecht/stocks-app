import { data } from '../data';

export function SaveStockData(){
  return dispatch => {
    dispatch({
      type: 'SAVE_STOCKDATA',
      payload: data
    })
  }
}