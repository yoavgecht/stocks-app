import { data } from '../data';
import axios from 'axios';

const url = '/api/save-ticker-data';

export function saveStockData(stockData) {
  return dispatch=> {
    return dispatch({
      type: 'SAVE_CONTACT',
      payload: axios.post(url, stockData)
    })
  }
}