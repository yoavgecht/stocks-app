import axios from 'axios';

const url = '/api/save-ticker-data';

export function saveStockData(stockData) {
  return dispatch=> {
    return dispatch({
      type: 'SAVE_STOCKDATA',
      payload: axios.post(url, stockData)
    })
  }
}


export function deleteStockData(_id) {
  return dispatch => {
    return dispatch({
      type: 'DELETE_STOCKDATA',
      payload: axios.delete(`${url}/${_id}`)
    })
  }
}