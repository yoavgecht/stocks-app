import axios from 'axios';

const getSearchedItemDataUrl = '/api/get-searched-item-data';
const saveTickerDataUrl = '/api/save-ticker-data';
const getSavedSearchesListUrl = '/api/get-saved-searches-list';
const deleteListSavedSearchesItemUrl = '/api/delete-list-saved-searches-item/';

export function getSavedSerchesList() {
  return dispatch => {
    return dispatch({
      type: 'GET_SAVED_SEARCHES_LIST',
      payload: axios.post(getSavedSearchesListUrl)
        .then( (response) =>  {
            dispatch(setSavedSearchesList(response))      
         })
      })
  }
}



export function setSavedSearchesList(SearchesList) {
  return dispatch => {
    return dispatch({
      type: 'SET_SAVED_SEARCHES_LIST',
      SearchesList,
      })
  }
}

export function setData(stockData) {
  return dispatch => {
    return dispatch({
      type: 'SET_DATA',
      stockData,
      })
  }
}

export function showClickedSearchItem(searchDate, stockName) {
  return dispatch => {
    return dispatch({
      type: 'GET_CLICKED_SEARCHED_ITEM_DATA',
      searchDate,
      stockName,
      payload: axios.post(getSearchedItemDataUrl, {date: searchDate, name: stockName})
        .then( (response) =>  {
            dispatch(setData(response.data))      
         })
      })
  }
}




export function saveStockData(stockData) {
  return dispatch => {
    return dispatch({
      type: 'SAVE_STOCKDATA',
      stockData,
      payload: axios.post(saveTickerDataUrl, stockData)
        .then( (response) =>  {
            dispatch(setSavedSearchesList(response))      
         })
      })
  }
}

export function deleteStock(stock) {
  return dispatch => {
    return dispatch({
      type: 'DELETE_STOCKDATA',
      payload: axios.delete(deleteListSavedSearchesItemUrl + stock).then( (response) =>  {
          dispatch(setSavedSearchesList(response))      
      })
    })
  }
}