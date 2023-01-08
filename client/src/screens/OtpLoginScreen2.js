import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Modal, Form } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import commaNumber from 'comma-number'
import OtpSteps from '../components/OtpSteps'

const OtpLoginScreen2 = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [show, setShow] = useState(true)
  
  const userLoginOtp = useSelector((state) => state.userOtpLogin)
  const { loading, error, userInfo } = userLoginOtp
  
  const { search } = useLocation()
  const redirect = search ? search.split('=')[1] : '/'
  
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  useEffect(() => {
    handleShow()
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, navigate, dispatch])

  const otpCodeSendHandler = (e) => {
    e.preventDefault()
    dispatch(otpLogin(code))
  }
 return (
    <>
      <Modal
           show={show}
           backdrop='true'
           onHide={handleClose}
           size='lg'
           aria-labelledby='contained-modal-title-vcenter'
           centered
           animation='true'
           keyboard='true'
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Link to='/login' className='btn btn-light my-3'>
            بازگشت
          </Link>
          <OtpSteps step2 />
          <Row>
            <Col md={6}>
              <ListGroup variant='flush'>
                <ListGroup.Item></ListGroup.Item>
              </ListGroup>
              {loading && <Loader />}

              <Form onSubmit={otpCodeSendHandler}>
                <Form.Group controlId='code'>
                  <Form.Label> کد تایید</Form.Label>
                  <Form.Control
                    type='code'
                    placeholder='کد را وارد کنید'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button
                  type='submit'
                  variant='primary'
                  onSubmit={otpCodeSendHandler}
                >
                  ارسال کد{' '}
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>بستن</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default OtpLoginScreen2
