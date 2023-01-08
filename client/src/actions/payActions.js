import {
  ZARINPAL_PAYMENT_FAIL,
  ZARINPAL_PAYMENT_REQUEST,
  ZARINPAL_PAYMENT_SUCCESS,
} from '../constants/payConstants'
import axios from 'axios'

export const pay = (amount,userId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ZARINPAL_PAYMENT_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { link } = axios.post(
      '/api/payment',
      {amount, userId},
      config
    )
    window.location.href = link



    dispatch({
      type: ZARINPAL_PAYMENT_SUCCESS,
     
    })
  } catch (error) {
    dispatch({
      type: ZARINPAL_PAYMENT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
