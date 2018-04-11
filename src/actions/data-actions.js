import axios from 'axios';

const saveUrl = '/api/save-ticker-data';

export function saveStockData(stockData) {
  return dispatch=> {
    return dispatch({
      type: 'SAVE_STOCKDATA',
      payload: axios.post(saveUrl, stockData)
    })
  }
}

const stock = '';
const deleteUrl = `/api/delete-ticker-data/:${stock}`;

export function deleteStockData(stock) {
  return dispatch => {
    return dispatch({
      type: 'DELETE_STOCKDATA',
      payload: axios.post(deleteUrl, {data: stock})
    })
  }
}