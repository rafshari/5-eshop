import {
  ZARINPAL_PAYMENT_FAIL,
  ZARINPAL_PAYMENT_REQUEST,
  ZARINPAL_PAYMENT_SUCCESS,
} from '../constants/payConstants'

export const payReducer = (state = {}, action) => {
  switch (action.type) {
    case ZARINPAL_PAYMENT_REQUEST:
      return { loading: true }
    case ZARINPAL_PAYMENT_SUCCESS:
      return { loading: false, success: true }
    case ZARINPAL_PAYMENT_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}
