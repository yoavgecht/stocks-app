const defaultState = {
  data: []
}

export default (state=defaultState, action={}) => {
  switch (action.type) {
    case 'SAVE_STOCKDATA': {
      return {
        ...state,
        data: action.payload
      }
    }

     case 'DELETE_STOCKDATA': {
      return {
        ...state,
        data: action.payload
      }
    }

       case 'SET_STOCKDATA': {
      return {
         ...state.searchHistory,
         data: [action.stockData]
      }
    }


    default:
      return state;
  }
}

