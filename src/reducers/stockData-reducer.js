const defaultState = {
  data: [],
  searchHistory: [],
  readyState: "loading"
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case "SAVE_STOCKDATA": {
      return {
        ...state,
        data: action.payload,
        readyState: "loading"
      };
    }

    case "FETCH_STOCKDATA_FULFILLED": {
      return {
        ...state,
        readyState: "success"
      };
    }

    case "DELETE_STOCKDATA": {
      return {
        ...state,
        data: action.payload
      };
    }

    case "SET_SAVED_SEARCHES_LIST": {
      console.log(action.SearchesList);
      return {
        ...state,
        searchHistory: [...action.SearchesList.data]
      };
    }

    case "SET_DATA": {
      return {
        ...state,
        data: [action.stockData]
      };
    }

    default:
      return state;
  }
};
