import axios from 'axios';

const saveUrl = '/api/save-ticker-data';
const SET_STOCKDATA = "SET_STOCKDATA"

export function setStockData(stockData) {
  return dispatch => {
    return dispatch({
      type: SET_STOCKDATA,
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
        .then( (response) =>  {
            dispatch(setStockData(response))      
         })
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