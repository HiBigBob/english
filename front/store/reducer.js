import { actionTypes } from './actions'

import Lists from './lists'

export const exampleInitialState = {
  count: 0,
  error: false,
  lastUpdate: 0,
  light: false,
  placeholderData: null,
  index: 0,
  lists: Lists,
  user: {},
  token: null
}

function reducer (state = exampleInitialState, action) {
  switch (action.type) {
    case actionTypes.FAILURE:
      return {
        ...state,
        ...{ error: action.error }
      }

    case actionTypes.INCREMENT:
      return {
        ...state,
        ...{ count: state.count + 1 }
      }

    case actionTypes.DECREMENT:
      return {
        ...state,
        ...{ count: state.count - 1 }
      }

    case actionTypes.RESET:
      return {
        ...state,
        ...{ count: exampleInitialState.count }
      }

    case actionTypes.LOAD_DATA_SUCCESS:
      return {
        ...state,
        ...{ placeholderData: action.data }
      }

    case actionTypes.TICK_CLOCK:
      return {
        ...state,
        ...{ lastUpdate: action.ts, light: !!action.light }
      }

    case actionTypes.LOAD_USER_SUCCESS:
      return {
        ...state,
        ...{ user: action.data }
      }

    case actionTypes.SET_TOKEN:
      return {
        ...state,
        ...{ token: action.data }
      }

    default:
      return state
  }
}

export default reducer
