import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Accordion } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login, loginOtp, otpSend } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const LoginScreen = () => {
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const dispatch = useDispatch()



  const userLogin = useSelector((state) =>  state.userLogin)
  const { loading, error, userInfo } = userLogin
  
  const userOtpSend = useSelector((state) => state.userOtpSend)
  const { loading:loadingOtpSend, success:successOtpSend, error:errorOtpSend } = userOtpSend

  const userLoginOtp = useSelector((state) =>  state.userOtpLogin)
  const { loading: loadingOtpLogin, error: errorOtpLogin } = userLoginOtp
  



  const  {search}  = useLocation()
  const redirect = search ? search.split('=')[1] : '/'
  // const redirect = location.search ? location.search.split('=')[1] : '/'

  const navigate = useNavigate()

useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
}, [userInfo, redirect, navigate, successOtpSend])

  const mobileSendHandler = (e) => {
    e.preventDefault()
    dispatch(otpSend(mobile))
  }
  const otpCodeSendHandler = (e) => {
    e.preventDefault()
   dispatch( loginOtp(mobile, code))
  }
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }
  return (
    <FormContainer>
      <h1>ورود / ثبت نام</h1>
      {error &&   <Message variant='danger'>{error}</Message>}
      {errorOtpSend &&   <Message variant='danger'>{errorOtpSend}</Message>}
      {errorOtpLogin &&   <Message variant='danger'>{errorOtpLogin}</Message>}

      {loading &&  <Loader />}
      {loadingOtpLogin &&  <Loader />}
      <Row className='py-3'>
        <Col>
          کاربر جدید هستید؟{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
           از اینجا ثبت نام کنید
          </Link>
        </Col>
      </Row>

      <Form onSubmit={mobileSendHandler}>
        <Form.Group controlId='mobile' >
          <Form.Label>   سلام! لطفا شماره موبایل خود را وارد نمایید:    </Form.Label>
          <Form.Control
            type='mobile'
            placeholder='شماره همراه'
            value={mobile}
            pattern="09(0[1-2]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}"
            onChange={(e) => setMobile(e.target.value)}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            شماره موبایل درست وارد کنید
          </Form.Control.Feedback>
        </Form.Group>
        <Button type='submit' variant='primary' onSubmit={mobileSendHandler}>
           دریافت کد یکبار مصرف{' '}
        </Button>
        {loadingOtpSend && <Loader />}

        </Form>
        <Form onSubmit={otpCodeSendHandler}>  

        <Form.Group controlId='code'>
          <Form.Label> کد یک بار مصرف را وارد نمایید:</Form.Label>
          <Form.Control
            type='code'
            placeholder='کد یک بار مصرف'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' onSubmit={otpCodeSendHandler}>
           ارسال کد{' '}
        </Button>
      </Form>

      
      <Row className='py-3'>
        <Col>
      
          <Accordion >
      <Accordion.Item eventKey="0">
        <Accordion.Header>      نام کاربری دارید؟    کلیک کنید   </Accordion.Header>
        <Accordion.Body>
        <Form onSubmit={submitHandler}  >
        <Form.Group controlId='email'>
          <Form.Label> نام کاربری  </Form.Label>
          <Form.Control
            type='email'
            placeholder='خود را وارد کنید email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>پسورد</Form.Label>
          <Form.Control
            type='password'
            placeholder='پسورد خود را وارد کنید'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>
          ورود{' '}
        </Button>
      </Form>

        </Accordion.Body>
      </Accordion.Item>
      </Accordion>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
