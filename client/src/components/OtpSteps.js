import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const OtpSteps = ({ step1, step2 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link> ارسال شماره همراه</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled> ارسال شماره همراه  </Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/code'>
            <Nav.Link>  ارسال کد  </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>  ارسال کد </Nav.Link>
        )}
      </Nav.Item>
     
    </Nav>
  )
}

export default OtpSteps
