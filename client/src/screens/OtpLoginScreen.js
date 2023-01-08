import React, { useState, useEffect } from 'react'
import {
  Button,
  Row,
  Col,
  ListGroup,
  Form,
  Modal,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import OtpSteps from '../components/OtpSteps'
import { otpSend } from '../actions/userActions'

const OtpLoginScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobile, setMobile] = useState('')
  const [show, setShow] = useState(true)

  const userOtpSend = useSelector((state) => state.userOtpSend)
  const { loading, success } = userOtpSend

  const userLoginOtp = useSelector((state) => state.userOtpLogin)
  const {
    userInfo,
  } = userLoginOtp

  useEffect(() => {
    handleShow()
    if (success) {
      navigate('/code')
    }
  }, [success, userInfo, navigate, dispatch])

  const mobileSendHandler = (e) => {
    e.preventDefault()
    dispatch(otpSend(mobile))
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        autoFocus
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OtpSteps step1 step2 />
          <Row>
            <Col md={6}>
              <ListGroup variant='flush'></ListGroup>
              <Form onSubmit={mobileSendHandler}>
                <Form.Group controlId='mobile'>
                  <Form.Label> شماره همراه: </Form.Label>
                  <Form.Control
                    type='mobile'
                    placeholder='شماره همراه خود را وارد نمایید'
                    value={mobile}
                    pattern='09(0[1-2]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}'
                    onChange={(e) => setMobile(e.target.value)}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    شماره موبایل درست وارد کنید
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  type='submit'
                  variant='primary'
                  onSubmit={mobileSendHandler}
                >
                  ارسال{' '}
                </Button>
                {loading && <Loader />}
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleShow}>بستن</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default OtpLoginScreen
