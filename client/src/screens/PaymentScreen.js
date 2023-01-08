import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
import { Link } from 'react-router-dom'

const PaymentScreen = () => {
  const navigate = useNavigate()
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress) {
    navigate('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('ZarinPal')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }
  return (
    <>
       <Link to='/shipping' className='btn btn-light my-3'>
    بازگشت
  </Link>
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>روش پرداخت</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>روش پرداخت خود را انتخاب نمایید</Form.Label>

          <Col>
            <Form.Check
              label=' پرداخت نقدی موقع تحویل'
              type='radio'
              name='paymentMethod'
              value='نقدی موقع تحویل'
              id='paymentMethod1'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              label='کارت به کارت'
              type='radio'
              name='paymentMethod'
              value='cartToCart'
              id='paymentMethod2'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              label='درگاه پرداخت اینترنتی زرین پال'
              type='radio'
              name='paymentMethod'
              value='ZarinPal'
              id='paymentMethod3'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          ادامه
        </Button>
      </Form>
    </FormContainer>
    </>
  )
}

export default PaymentScreen
