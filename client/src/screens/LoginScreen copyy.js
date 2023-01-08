import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

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
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>ورود</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>آدرس پست الکترونیکی</Form.Label>
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
      <Row className='py-3'>
        <Col>
          کاربر جدید هستید؟{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            ثبت نام
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
