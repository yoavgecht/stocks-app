import axios from 'axios';

const saveUrl = '/api/save-ticker-data';

export function setStockData(stockData) {
  return dispatch=> {
    return dispatch({
      type: 'SET_STOCKDATA',
      stockData,
      })
  }
}


export function saveStockData(stockData) {
  return dispatch=> {
    return dispatch({
      type: 'SAVE_STOCKDATA',
      stockData,
      payload: axios.post(saveUrl, stockData)
        .then( response => response.json())    
        .then(data => dispatch(setStockData(data))) 
      })
  }
}

export function deleteStockData(stock) {
  return dispatch => {
    return dispatch({
      type: 'DELETE_STOCKDATA',
      payload: axios.delete(`/api/delete-ticker-data/:${stock}`)
    })
  }
}