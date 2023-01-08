import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link>ورود/ثبت نام</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled> ورود/ثبت نام  </Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link>محل ارسال</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled> محل ارسال </Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link>روش پرداخت</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled> پرداخت </Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link>تایید سفارش</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled> تایید سفارش </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
