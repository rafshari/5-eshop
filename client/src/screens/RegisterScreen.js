import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const { search } = useLocation()
  const redirect = search ? search.split('=')[1] : '/'
  // const redirect = location.search ? location.search.split('=')[1] : '/'
  //console.log(userInfo);
  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(name, mobile ,email, password))
    }
  }
  return (
    <FormContainer>
      <h1>ثبت نام</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label >  نام و نام خانوادگی   </Form.Label>
          <Form.Control
            type='name'
            placeholder='نام و نام خانوادگی را وارد کنید'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='mobile'>
          <Form.Label>شماره همراه: </Form.Label>
          <Form.Control
            type='mobile'
            placeholder='شماره همراه خود را وارد کنید'
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>آدرس ایمیل</Form.Label>
          <Form.Control
            type='email'
            placeholder='ایمیل خود را وارد کنید'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='پسورد'>
          <Form.Label>پسورد</Form.Label>
          <Form.Control
            type='password'
            placeholder='پسورد خود را وارد کنید'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>پسورد </Form.Label>
          <Form.Control
            type='password'
            placeholder='پسورد خود را مجدد وارد کنید'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>
          ثبت نام
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
           قبلا ثبت نام کرده اید ؟{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            ورود
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
