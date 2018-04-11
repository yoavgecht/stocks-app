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


    default:
      return state;
  }
}

