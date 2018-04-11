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

const deleteUrl = '/api/delete-ticker-data';

export function deleteStockData(stock) {
  return dispatch => {
    return dispatch({
      type: 'DELETE_STOCKDATA',
      payload: axios.delete(deleteUrl, stock)
    })
  }
}