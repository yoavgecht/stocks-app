export function SaveStockData(){
  return dispatch => {
    dispatch({
      type: 'SAVE_STOCKDATA',
      payload: data
    })
  }
}