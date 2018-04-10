const defaultState = {
  data: []
}

export default (state=defaultState, action={}) => {
  switch (action.type) {
    case 'SAVE_STOCKDATA': {
      return {
        ...state,
        contacts: action.payload
      }
    }
    default:
      return state;
  }
}